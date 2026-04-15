export interface MethodInfo {
  name: string;
  type: 'unary' | 'subscription';
  defaultRequest?: string;
  noParams?: boolean;
}

export interface ServiceInfo {
  name: string;
  methods: MethodInfo[];
}

const PASEO_GENESIS = '0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2';

export const services: ServiceInfo[] = [
  {
    name: 'TrUPI CALLS',
    methods: [
      { name: 'host_feature_supported', type: 'unary', defaultRequest: `{ "tag": "Chain", "value": "${PASEO_GENESIS}" }` },
      { name: 'host_navigate_to', type: 'unary', defaultRequest: '"https://example.com"' },
      { name: 'host_push_notification', type: 'unary', defaultRequest: '{ "text": "Hello!", "deeplink": null }' },
    ],
  },
  {
    name: 'Permissions',
    methods: [
      { name: 'host_device_permission', type: 'unary', defaultRequest: '{ "tag": "Camera", "value": null }' },
      { name: 'remote_permission', type: 'unary', defaultRequest: '{ "tag": "ExternalRequest", "value": "https://api.example.com" }' },
    ],
  },
  {
    name: 'Local Storage',
    methods: [
      { name: 'host_local_storage_read', type: 'unary', defaultRequest: '"test-key"' },
      { name: 'host_local_storage_write', type: 'unary', defaultRequest: '["test-key", "0x48656c6c6f"]' },
      { name: 'host_local_storage_clear', type: 'unary', defaultRequest: '"test-key"' },
    ],
  },
  {
    name: 'Account Management',
    methods: [
      { name: 'host_account_get', type: 'unary', defaultRequest: '["polkadot", 0]' },
      { name: 'host_account_alias', type: 'unary', defaultRequest: '["polkadot", 0]' },
      { name: 'host_account_create_proof', type: 'unary', noParams: true },
      { name: 'host_get_non_product_accounts', type: 'unary', noParams: true },
      { name: 'host_account_connection_status', type: 'subscription', noParams: true },
      { name: 'host_get_user_id', type: 'unary', noParams: true },
    ],
  },
  {
    name: 'Signing',
    methods: [
      { name: 'host_sign_payload', type: 'unary', noParams: true },
      { name: 'host_sign_raw', type: 'unary', defaultRequest: '{ "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "data": { "tag": "Bytes", "value": "0x48656c6c6f" } }' },
      { name: 'host_create_transaction', type: 'unary', noParams: true },
      { name: 'host_create_transaction_with_non_product_account', type: 'unary', noParams: true },
    ],
  },
  {
    name: 'Chat',
    methods: [
      { name: 'host_chat_create_room', type: 'unary', defaultRequest: '{ "roomId": "test-room", "name": "Test Room", "icon": "" }' },
      { name: 'host_chat_register_bot', type: 'unary', defaultRequest: '{ "botId": "test-bot", "name": "Test Bot", "icon": "" }' },
      { name: 'host_chat_post_message', type: 'unary', defaultRequest: '{ "roomId": "test-room", "payload": { "tag": "Text", "value": "Hello from playground!" } }' },
      { name: 'host_chat_list_subscribe', type: 'subscription', noParams: true },
      { name: 'host_chat_action_subscribe', type: 'subscription', noParams: true },
      { name: 'product_chat_custom_message_render_subscribe', type: 'subscription', noParams: true },
      { name: 'host_chat_create_simple_group', type: 'unary', noParams: true },
    ],
  },
  {
    name: 'Statement Store',
    methods: [
      { name: 'remote_statement_store_subscribe', type: 'subscription', noParams: true },
      { name: 'remote_statement_store_create_proof', type: 'unary', noParams: true },
      { name: 'remote_statement_store_submit', type: 'unary', noParams: true },
    ],
  },
  {
    name: 'Preimage',
    methods: [
      { name: 'remote_preimage_lookup_subscribe', type: 'subscription', noParams: true },
    ],
  },
  {
    name: 'Chain Interaction',
    methods: [
      { name: 'remote_chain_head_follow', type: 'subscription', defaultRequest: `{ "genesisHash": "${PASEO_GENESIS}", "withRuntime": false }` },
      { name: 'remote_chain_head_header', type: 'unary', noParams: true },
      { name: 'remote_chain_head_body', type: 'unary', noParams: true },
      { name: 'remote_chain_head_storage', type: 'unary', noParams: true },
      { name: 'remote_chain_head_call', type: 'unary', noParams: true },
      { name: 'remote_chain_head_unpin', type: 'unary', noParams: true },
      { name: 'remote_chain_head_continue', type: 'unary', noParams: true },
      { name: 'remote_chain_head_stop_operation', type: 'unary', noParams: true },
      { name: 'remote_chain_spec_genesis_hash', type: 'unary', defaultRequest: `"${PASEO_GENESIS}"` },
      { name: 'remote_chain_spec_chain_name', type: 'unary', defaultRequest: `"${PASEO_GENESIS}"` },
      { name: 'remote_chain_spec_properties', type: 'unary', defaultRequest: `"${PASEO_GENESIS}"` },
      { name: 'remote_chain_transaction_broadcast', type: 'unary', noParams: true },
      { name: 'remote_chain_transaction_stop', type: 'unary', noParams: true },
    ],
  },
  {
    name: 'Payment',
    methods: [
      { name: 'host_payment_balance_subscribe', type: 'subscription', noParams: true },
      { name: 'host_payment_top_up', type: 'unary', noParams: true },      
      { name: 'host_payment_request', type: 'unary', noParams: true },
      { name: 'host_payment_status_subscribe', type: 'subscription', noParams: true },
    ],
  },
  {
    name: 'Entropy',
    methods: [
      { name: 'host_derive_entropy', type: 'unary', noParams: true },
    ],
  },
  {
    name: 'JsonRpc',
    methods: [
      { name: 'MessageSend', type: 'unary', defaultRequest: `["${PASEO_GENESIS}", "{\\"jsonrpc\\":\\"2.0\\",\\"id\\":1,\\"method\\":\\"system_chain\\",\\"params\\":[]}"]` },
      { name: 'MessageSubscribe', type: 'subscription', defaultRequest: `"${PASEO_GENESIS}"` },
    ],
  },
];
