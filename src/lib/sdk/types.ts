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

export type TestCategory =
  | "extension"
  | "accounts"
  | "signing"
  | "storage"
  | "permissions"
  | "chat";

export interface ChainConfig {
  name: string;
  network: string;
  genesis: `0x${string}`;
}

export interface TestDefinition {
  id: string;
  name: string;
  description: string;
  category: TestCategory;
  requiresIframe?: boolean;
  run: (chain: ChainConfig) => Promise<TestResult>;
}

// Chain configurations
export const CHAINS = {
  PASSET_HUB: {
    name: "Passet Hub",
    network: "Paseo",
    genesis:
      "0xfd974cf9eaf028f5e44b9fdd1949ab039c6cf9cc54449b0b60d71b042e79aeb6" as const,
  },
  PASEO_ASSET_HUB: {
    name: "Paseo Hub",
    network: "Paseo",
    genesis:
      "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2" as const,
  },
  POLKADOT_ASSET_HUB: {
    name: "Polkadot Hub",
    network: "Polkadot",
    genesis:
      "0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f" as const,
  },
} as const;

export type ChainId = keyof typeof CHAINS;
