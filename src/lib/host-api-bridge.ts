import type { HostApi, Subscription } from '@novasamatech/host-api';
import { enumValue } from '@novasamatech/host-api';

export type MethodBinding =
  | { isStream: false; call: (req: unknown) => Promise<{ ok: boolean; data: unknown }> }
  | { isStream: true; subscribe: (req: unknown, onEvent: (data: unknown) => void, onEnd: () => void) => { unsubscribe: () => void } };

// Maps ServiceName/MethodName -> [hostApiMethodName, isStream]
const methodMap: Record<string, [string, boolean]> = {
  // TrUPI CALLS
  'TrUPI CALLS/host_feature_supported': ['featureSupported', false],
  'TrUPI CALLS/host_navigate_to': ['navigateTo', false],
  'TrUPI CALLS/host_push_notification': ['pushNotification', false],

  // Permissions
  'Permissions/host_device_permission': ['devicePermission', false],
  'Permissions/remote_permission': ['permission', false],

  // Local Storage
  'Local Storage/host_local_storage_read': ['localStorageRead', false],
  'Local Storage/host_local_storage_write': ['localStorageWrite', false],
  'Local Storage/host_local_storage_clear': ['localStorageClear', false],

  // Account Management
  'Account Management/host_account_get': ['accountGet', false],
  'Account Management/host_account_alias': ['accountGetAlias', false],
  'Account Management/host_account_create_proof': ['accountCreateProof', false],
  'Account Management/host_get_non_product_accounts': ['getNonProductAccounts', false],
  'Account Management/host_account_connection_status': ['accountConnectionStatusSubscribe', true],

  // Signing
  'Signing/host_sign_payload': ['signPayload', false],
  'Signing/host_sign_raw': ['signRaw', false],
  'Signing/host_create_transaction': ['createTransaction', false],
  'Signing/host_create_transaction_with_non_product_account': ['createTransactionWithNonProductAccount', false],

  // Chat
  'Chat/host_chat_create_room': ['chatCreateRoom', false],
  'Chat/host_chat_register_bot': ['chatRegisterBot', false],
  'Chat/host_chat_post_message': ['chatPostMessage', false],
  'Chat/host_chat_list_subscribe': ['chatListSubscribe', true],
  'Chat/host_chat_action_subscribe': ['chatActionSubscribe', true],
  'Chat/product_chat_custom_message_render_subscribe': ['productChatCustomMessageRenderSubscribe', true],

  // Statement Store
  'Statement Store/remote_statement_store_subscribe': ['statementStoreSubscribe', true],
  'Statement Store/remote_statement_store_create_proof': ['statementStoreCreateProof', false],
  'Statement Store/remote_statement_store_submit': ['statementStoreSubmit', false],

  // Preimage
  'Preimage/remote_preimage_lookup_subscribe': ['preimageLookupSubscribe', true],

  // Chain Interaction
  'Chain Interaction/remote_chain_head_follow': ['chainHeadFollow', true],
  'Chain Interaction/remote_chain_head_header': ['chainHeadHeader', false],
  'Chain Interaction/remote_chain_head_body': ['chainHeadBody', false],
  'Chain Interaction/remote_chain_head_storage': ['chainHeadStorage', false],
  'Chain Interaction/remote_chain_head_call': ['chainHeadCall', false],
  'Chain Interaction/remote_chain_head_unpin': ['chainHeadUnpin', false],
  'Chain Interaction/remote_chain_head_continue': ['chainHeadContinue', false],
  'Chain Interaction/remote_chain_head_stop_operation': ['chainHeadStopOperation', false],
  'Chain Interaction/remote_chain_spec_genesis_hash': ['chainSpecGenesisHash', false],
  'Chain Interaction/remote_chain_spec_chain_name': ['chainSpecChainName', false],
  'Chain Interaction/remote_chain_spec_properties': ['chainSpecProperties', false],
  'Chain Interaction/remote_chain_transaction_broadcast': ['chainTransactionBroadcast', false],
  'Chain Interaction/remote_chain_transaction_stop': ['chainTransactionStop', false],

  // JsonRpc
  'JsonRpc/MessageSend': ['jsonrpcMessageSend', false],
  'JsonRpc/MessageSubscribe': ['jsonrpcMessageSubscribe', true],
};

export function getMethodBinding(
  hostApi: HostApi,
  service: string,
  method: string,
): MethodBinding | null {
  const entry = methodMap[`${service}/${method}`];
  if (!entry) return null;

  const [methodName, isStream] = entry;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fn = (hostApi as any)[methodName];
  if (!fn) return null;

  if (isStream) {
    return {
      isStream: true,
      subscribe(req, onEvent, onEnd) {
        const args = enumValue('v1', req);
        const subscription: Subscription = fn.call(hostApi, args, onEvent);
        subscription.onInterrupt(onEnd);
        return { unsubscribe: () => subscription.unsubscribe() };
      },
    };
  }

  return {
    isStream: false,
    async call(req) {
      const args = enumValue('v1', req);
      const result = await fn.call(hostApi, args);
      return result.match(
        (ok: { tag: string; value: unknown }) => ({ ok: true, data: ok.value }),
        (err: { tag: string; value: unknown }) => ({ ok: false, data: err.value }),
      );
    },
  };
}

// JSON serializer that handles Uint8Array and bigint
export function stringify(value: unknown): string {
  return JSON.stringify(
    value,
    (_, v) => {
      if (v instanceof Uint8Array) {
        return '0x' + Array.from(v).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      if (typeof v === 'bigint') return v.toString();
      return v;
    },
    2,
  );
}
