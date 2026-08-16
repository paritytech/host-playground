import { isCorrectEnvironment as isCorrectEnvironment$1, getClientSync as getClientSync$1 } from '@parity/truapi/sandbox';

// src/transport.ts
var clientOverride = null;
function isProductionBuild() {
  try {
    return process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
}
function setTruApiClient(client) {
  if (client !== null && isProductionBuild()) {
    console.warn(
      "[product-sdk] setTruApiClient() was called in a production build. This is a test-only seam from @parity/product-sdk-host/testing; a leaked import will silently reroute all host access to the injected client."
    );
  }
  clientOverride = client;
}
function getClientSync() {
  return clientOverride ?? getClientSync$1();
}
function isCorrectEnvironment() {
  return clientOverride !== null || isCorrectEnvironment$1();
}
async function getClient() {
  return getClientSync();
}
function subscribeWithInterrupt(observable, onNext) {
  let interruptCallback;
  const sub = observable.subscribe({
    next: onNext,
    error: (reason) => interruptCallback?.(reason),
    complete: () => interruptCallback?.()
  });
  return {
    subscriptionId: sub.subscriptionId,
    unsubscribe: () => sub.unsubscribe(),
    onInterrupt: (callback) => {
      interruptCallback = callback;
      return () => {
        if (interruptCallback === callback) interruptCallback = void 0;
      };
    }
  };
}

export { getClient, isCorrectEnvironment, setTruApiClient, subscribeWithInterrupt };
//# sourceMappingURL=chunk-GDXSV7JV.js.map
//# sourceMappingURL=chunk-GDXSV7JV.js.map