import type { JsonRpcProvider } from "polkadot-api";

/**
 * Re-establish the chainHead_v1 ordering guarantee the host bridge loses.
 *
 * The spec requires a `chainHead_v1_storage`/`_call`/`_body` response (which
 * names the `operationId`) to reach the client BEFORE any operation event for
 * that id. Over the host bridge the two race: the truapi host emits operation
 * events on the follow stream while the call response travels back separately,
 * and `@parity/product-sdk-host` forwards each as it lands. When an event wins
 * the race, papi drops it as belonging to an unknown operation, the query never
 * resolves, and client initialization hangs forever with no error — which is
 * how every chain card used to time out against `truapi-host` (observed there;
 * the same race is possible against any host).
 *
 * The shim holds back operation events whose id no response has named yet, and
 * replays them right after the response that names it. Terminal events retire
 * the id so the host can reuse it.
 */

type RpcMessage = Parameters<Parameters<JsonRpcProvider>[0]>[0];
/** The fields this shim reads; papi's JsonRpcMessage union hides them. */
type MessageView = {
  method?: string;
  params?: { result?: { event?: string; operationId?: string } };
  result?: { result?: string; operationId?: string };
};
const view = (message: RpcMessage): MessageView => message as MessageView;

const TERMINAL_EVENTS = new Set([
  "operationBodyDone",
  "operationCallDone",
  "operationStorageDone",
  "operationError",
  "operationInaccessible",
]);

export function withOperationEventOrder(
  provider: JsonRpcProvider,
): JsonRpcProvider {
  return (onMessage) => {
    const known = new Set<string>();
    const held = new Map<string, RpcMessage[]>();

    const deliverEvent = (message: RpcMessage) => {
      onMessage(message);
      const event = view(message).params?.result;
      if (event?.operationId && TERMINAL_EVENTS.has(event.event ?? "")) {
        known.delete(event.operationId);
      }
    };

    return provider((message) => {
      const { method, params, result } = view(message);
      const event =
        method === "chainHead_v1_followEvent" ? params?.result : undefined;

      if (event?.operationId !== undefined) {
        if (known.has(event.operationId)) deliverEvent(message);
        else {
          const queue = held.get(event.operationId) ?? [];
          queue.push(message);
          held.set(event.operationId, queue);
        }
        return;
      }

      // A stop ends the follow and every operation with it.
      if (event?.event === "stop") {
        known.clear();
        held.clear();
      }

      onMessage(message);

      const operationId = result?.operationId;
      if (result?.result === "started" && operationId !== undefined) {
        known.add(operationId);
        const queue = held.get(operationId);
        held.delete(operationId);
        queue?.forEach(deliverEvent);
      }
    });
  };
}
