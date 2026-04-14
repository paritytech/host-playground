export interface MethodInfo {
  name: string;
  type: 'unary' | 'subscription';
}

export interface ServiceInfo {
  name: string;
  methods: MethodInfo[];
}

export const services: ServiceInfo[] = [
  {
    name: 'GeneralService',
    methods: [
      { name: 'FeatureSupported', type: 'unary' },
      { name: 'NavigateTo', type: 'unary' },
      { name: 'PushNotification', type: 'unary' },
    ],
  },
  {
    name: 'PermissionsService',
    methods: [
      { name: 'DevicePermission', type: 'unary' },
      { name: 'Permission', type: 'unary' },
    ],
  },
  {
    name: 'LocalStorageService',
    methods: [
      { name: 'Read', type: 'unary' },
      { name: 'Write', type: 'unary' },
      { name: 'Clear', type: 'unary' },
    ],
  },
  {
    name: 'AccountService',
    methods: [
      { name: 'GetAccount', type: 'unary' },
      { name: 'GetAlias', type: 'unary' },
      { name: 'CreateProof', type: 'unary' },
      { name: 'GetNonProductAccounts', type: 'unary' },
      { name: 'ConnectionStatusSubscribe', type: 'subscription' },
    ],
  },
  {
    name: 'SigningService',
    methods: [
      { name: 'SignPayload', type: 'unary' },
      { name: 'SignRaw', type: 'unary' },
      { name: 'CreateTransaction', type: 'unary' },
      { name: 'CreateTransactionNonProduct', type: 'unary' },
    ],
  },
  {
    name: 'ChatService',
    methods: [
      { name: 'CreateRoom', type: 'unary' },
      { name: 'RegisterBot', type: 'unary' },
      { name: 'PostMessage', type: 'unary' },
      { name: 'ListSubscribe', type: 'subscription' },
      { name: 'ActionSubscribe', type: 'subscription' },
      { name: 'CustomRenderSubscribe', type: 'subscription' },
    ],
  },
  {
    name: 'StatementStoreService',
    methods: [
      { name: 'Subscribe', type: 'subscription' },
      { name: 'CreateProof', type: 'unary' },
      { name: 'Submit', type: 'unary' },
    ],
  },
  {
    name: 'PreimageService',
    methods: [
      { name: 'LookupSubscribe', type: 'subscription' },
      { name: 'Submit', type: 'unary' },
    ],
  },
  {
    name: 'ChainService',
    methods: [
      { name: 'HeadFollow', type: 'subscription' },
      { name: 'HeadHeader', type: 'unary' },
      { name: 'HeadBody', type: 'unary' },
      { name: 'HeadStorage', type: 'unary' },
      { name: 'HeadCall', type: 'unary' },
      { name: 'HeadUnpin', type: 'unary' },
      { name: 'HeadContinue', type: 'unary' },
      { name: 'HeadStopOperation', type: 'unary' },
      { name: 'SpecGenesisHash', type: 'unary' },
      { name: 'SpecChainName', type: 'unary' },
      { name: 'SpecProperties', type: 'unary' },
      { name: 'TransactionBroadcast', type: 'unary' },
      { name: 'TransactionStop', type: 'unary' },
    ],
  },
  {
    name: 'JsonRpcService',
    methods: [
      { name: 'MessageSend', type: 'unary' },
      { name: 'MessageSubscribe', type: 'subscription' },
    ],
  },
];

const PASEO_GENESIS = '0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2';

// SCALE Enum values use { tag, value } format. Struct values use plain objects.
export function getDefaultRequest(service: string, method: string): string {
  const defaults: Record<string, string> = {
    // General
    'GeneralService/FeatureSupported': `{ "tag": "Chain", "value": "${PASEO_GENESIS}" }`,
    'GeneralService/NavigateTo': '"https://example.com"',
    'GeneralService/PushNotification': '{ "text": "Hello!", "deeplink": null }',

    // Permissions (DevicePermission is a Status enum, Permission is an Enum)
    'PermissionsService/DevicePermission': '{ "tag": "Camera", "value": null }',
    'PermissionsService/Permission': '{ "tag": "ExternalRequest", "value": "https://api.example.com" }',

    // LocalStorage (Read/Clear take a string key, Write takes a [key, bytes] tuple)
    'LocalStorageService/Read': '"test-key"',
    'LocalStorageService/Write': '["test-key", "0x48656c6c6f"]',
    'LocalStorageService/Clear': '"test-key"',

    // Account (Get/GetAlias take [domain, derivationIndex] tuple)
    'AccountService/GetAccount': '["polkadot", 0]',
    'AccountService/GetAlias': '["polkadot", 0]',
    'AccountService/GetNonProductAccounts': 'null',
    'AccountService/ConnectionStatusSubscribe': 'null',

    // Signing (SignRaw.data is an Enum)
    'SigningService/SignRaw': '{ "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "data": { "tag": "Bytes", "value": "0x48656c6c6f" } }',

    // Chat (PostMessage.payload is an Enum)
    'ChatService/CreateRoom': '{ "roomId": "test-room", "name": "Test Room", "icon": "" }',
    'ChatService/RegisterBot': '{ "botId": "test-bot", "name": "Test Bot", "icon": "" }',
    'ChatService/PostMessage': '{ "roomId": "test-room", "payload": { "tag": "Text", "value": "Hello from playground!" } }',
    'ChatService/ListSubscribe': 'null',
    'ChatService/ActionSubscribe': 'null',

    // Chain
    'ChainService/HeadFollow': `{ "genesisHash": "${PASEO_GENESIS}", "withRuntime": false }`,
    'ChainService/SpecGenesisHash': `"${PASEO_GENESIS}"`,
    'ChainService/SpecChainName': `"${PASEO_GENESIS}"`,
    'ChainService/SpecProperties': `"${PASEO_GENESIS}"`,

    // JsonRpc
    'JsonRpcService/MessageSend': `["${PASEO_GENESIS}", "{\\"jsonrpc\\":\\"2.0\\",\\"id\\":1,\\"method\\":\\"system_chain\\",\\"params\\":[]}"]`,
    'JsonRpcService/MessageSubscribe': `"${PASEO_GENESIS}"`,
  };
  return defaults[`${service}/${method}`] || '{}';
}
