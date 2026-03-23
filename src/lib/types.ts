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
  | "chat"
  | "statements"
  | "preimage"
  | "notifications"
  | "navigation";

export interface ChainConfig {
  name: string;
  network: string;
  genesis: `0x${string}`;
  wsUrl: string;
}

export interface TestArg {
  name: string;
  label: string;
  defaultValue: string;
}

export interface TestDefinition {
  id: string;
  name: string;
  description: string;
  api: string;
  args?: TestArg[];
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
  PASEO_ASSET_HUB: {
    name: "Paseo Hub",
    network: "Testnet",
    genesis:
      "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2" as const,
    wsUrl: "wss://sys.ibp.network/asset-hub-paseo",
  },
  POLKADOT_ASSET_HUB: {
    name: "Polkadot Hub",
    network: "Mainnet",
    genesis:
      "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f" as const,
    wsUrl: "wss://sys.ibp.network/asset-hub-polkadot",
  },
  PREVIEWNET_ASSET_HUB: {
    name: "Previewnet Hub",
    network: "Testnet",
    genesis:
      "0x4bad3ce960c32a1d55005d258883d14fc6eca4486af35500bed93c314fbdb192" as const,
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
  },
} as const;

export type ChainId = keyof typeof CHAINS;
