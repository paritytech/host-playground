import type { HostApi, Subscription } from '@novasamatech/host-api';
import { enumValue } from '@novasamatech/host-api';

export type MethodBinding =
  | { isStream: false; call: (req: unknown) => Promise<{ ok: boolean; data: unknown }> }
  | { isStream: true; subscribe: (req: unknown, onEvent: (data: unknown) => void, onEnd: () => void) => { unsubscribe: () => void } };

// Maps ServiceName/MethodName -> [hostApiMethodName, isStream]
const methodMap: Record<string, [string, boolean]> = {
  // General
  'GeneralService/FeatureSupported': ['featureSupported', false],
  'GeneralService/NavigateTo': ['navigateTo', false],
  'GeneralService/PushNotification': ['pushNotification', false],

  // Permissions
  'PermissionsService/DevicePermission': ['devicePermission', false],
  'PermissionsService/Permission': ['permission', false],

  // LocalStorage
  'LocalStorageService/Read': ['localStorageRead', false],
  'LocalStorageService/Write': ['localStorageWrite', false],
  'LocalStorageService/Clear': ['localStorageClear', false],

  // Account
  'AccountService/GetAccount': ['accountGet', false],
  'AccountService/GetAlias': ['accountGetAlias', false],
  'AccountService/CreateProof': ['accountCreateProof', false],
  'AccountService/GetNonProductAccounts': ['getNonProductAccounts', false],
  'AccountService/ConnectionStatusSubscribe': ['accountConnectionStatusSubscribe', true],

  // Signing
  'SigningService/SignPayload': ['signPayload', false],
  'SigningService/SignRaw': ['signRaw', false],
  'SigningService/CreateTransaction': ['createTransaction', false],
  'SigningService/CreateTransactionNonProduct': ['createTransactionWithNonProductAccount', false],

  // Chat
  'ChatService/CreateRoom': ['chatCreateRoom', false],
  'ChatService/RegisterBot': ['chatRegisterBot', false],
  'ChatService/PostMessage': ['chatPostMessage', false],
  'ChatService/ListSubscribe': ['chatListSubscribe', true],
  'ChatService/ActionSubscribe': ['chatActionSubscribe', true],
  'ChatService/CustomRenderSubscribe': ['productChatCustomMessageRenderSubscribe', true],

  // StatementStore
  'StatementStoreService/Subscribe': ['statementStoreSubscribe', true],
  'StatementStoreService/CreateProof': ['statementStoreCreateProof', false],
  'StatementStoreService/Submit': ['statementStoreSubmit', false],

  // Preimage
  'PreimageService/LookupSubscribe': ['preimageLookupSubscribe', true],
  'PreimageService/Submit': ['preimageSubmit', false],

  // Chain
  'ChainService/HeadFollow': ['chainHeadFollow', true],
  'ChainService/HeadHeader': ['chainHeadHeader', false],
  'ChainService/HeadBody': ['chainHeadBody', false],
  'ChainService/HeadStorage': ['chainHeadStorage', false],
  'ChainService/HeadCall': ['chainHeadCall', false],
  'ChainService/HeadUnpin': ['chainHeadUnpin', false],
  'ChainService/HeadContinue': ['chainHeadContinue', false],
  'ChainService/HeadStopOperation': ['chainHeadStopOperation', false],
  'ChainService/SpecGenesisHash': ['chainSpecGenesisHash', false],
  'ChainService/SpecChainName': ['chainSpecChainName', false],
  'ChainService/SpecProperties': ['chainSpecProperties', false],
  'ChainService/TransactionBroadcast': ['chainTransactionBroadcast', false],
  'ChainService/TransactionStop': ['chainTransactionStop', false],

  // JsonRpc
  'JsonRpcService/MessageSend': ['jsonrpcMessageSend', false],
  'JsonRpcService/MessageSubscribe': ['jsonrpcMessageSubscribe', true],
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
