export type LogStatus = "success" | "error" | "info" | "pending";

export interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  status: LogStatus;
  message: string;
  details?: string;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: unknown;
}

export type TestLogger = (message: string) => void;

export type TestCategory =
  | "extension"
  | "accounts"
  | "signing"
  | "storage"
  | "permissions"
  | "statements"
  | "preimage"
  | "notifications"
  | "navigation"
  | "chain"
  | "contract"
  | "theme"
  | "entropy"
  | "payments"
  | "auth"
  | "allowances";

export interface ChainConfig {
  name: string;
  network: string;
  genesis: `0x${string}`;
  wsUrl: string;
  ss58Prefix: number;
  papiNetworkId?: string;
  peopleWsUrl?: string;
  peopleNetworkId?: string;
  bulletinWsUrl?: string;
}

export interface TestArg {
  name: string;
  label: string;
  defaultValue: string | (() => Promise<string>);
}

export interface TestDefinition {
  id: string;
  name: string;
  description: string;
  api: string;
  args?: TestArg[];
  warning?: string;
  disabled?: string;
  category: TestCategory;
  run: (
    chain: ChainConfig,
    logger?: TestLogger,
    args?: Record<string, string>,
    navigate?: (path: string) => void,
  ) => Promise<TestResult>;
}

// Chain configurations
export const CHAINS = {
  PASEO_NEXT_V2_ASSET_HUB: {
    name: "Paseo Next v2 Hub",
    network: "Testnet",
    genesis:
      "0xbf0488dbe9daa1de1c08c5f743e26fdc2a4ecd74cf87dd1b4b1eeb99ae4ef19f" as const,
    wsUrl: "wss://paseo-asset-hub-next-rpc.polkadot.io",
    ss58Prefix: 0,
    peopleWsUrl: "wss://paseo-people-next-system-rpc.polkadot.io",
    bulletinWsUrl: "wss://paseo-bulletin-next-rpc.polkadot.io",
  },
  PREVIEWNET_ASSET_HUB: {
    name: "Previewnet Hub",
    network: "Testnet",
    genesis:
      "0x29f7b15e6227f86b90bf5199b5c872c28649a30e5f15fae6dd8fa9d5d48d6fbb" as const,
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
    ss58Prefix: 0,
    peopleWsUrl: "wss://previewnet.substrate.dev/people",
    bulletinWsUrl: "wss://previewnet.substrate.dev/bulletin",
  },
  PASEO_ASSET_HUB: {
    name: "Paseo Hub v1 (deprecated)",
    network: "Testnet",
    genesis:
      "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2" as const,
    wsUrl: "wss://sys.ibp.network/asset-hub-paseo",
    ss58Prefix: 0,
    papiNetworkId: "paseo_asset_hub",
    peopleNetworkId: "paseo_people",
  },
} as const;

export type ChainId = keyof typeof CHAINS;

const CHAIN_ID_BY_GENESIS = Object.fromEntries(
  (Object.keys(CHAINS) as ChainId[]).map((id) => [CHAINS[id].genesis, id]),
) as Record<string, ChainId>;

export const ACTIVE_CHAIN_ID: ChainId =
  CHAIN_ID_BY_GENESIS[process.env.NEXT_PUBLIC_NETWORK_GENESIS_HASH ?? ""] ??
  "PREVIEWNET_ASSET_HUB";

export const ACTIVE_CHAIN: ChainConfig = CHAINS[ACTIVE_CHAIN_ID];
