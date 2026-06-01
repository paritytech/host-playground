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
  ipfs?: string;
  ss58Prefix: number;
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
    // Gateway returns 404 without the `/ipfs/<cid>` path segment and 504
    // (try-then-fail) with it — confirmed by direct probe 2026-05-26.
    // Keeping the path in the config matches the other two networks
    // (`/ipfs` on PASEO_ASSET_HUB, `/ipfs/` on PREVIEWNET_ASSET_HUB) so
    // the bulletin-upload test's `${chain.ipfs}/${cid}` URL works
    // uniformly across networks.
    ipfs: "https://paseo-bulletin-next-ipfs.polkadot.io/ipfs",
    ss58Prefix: 0,
  },
  PREVIEWNET_ASSET_HUB: {
    name: "Previewnet Hub",
    network: "Testnet",
    genesis:
      "0x4bad3ce960c32a1d55005d258883d14fc6eca4486af35500bed93c314fbdb192" as const,
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
    ipfs: "https://previewnet.substrate.dev/ipfs/",
    ss58Prefix: 0,
  },
  PASEO_ASSET_HUB: {
    name: "Paseo Hub v1 (deprecated)",
    network: "Testnet",
    genesis:
      "0xd6eec26135305a8ad257a20d003357284c8aa03d0bdb2b357ab0a22371e11ef2" as const,
    wsUrl: "wss://sys.ibp.network/asset-hub-paseo",
    ipfs: "https://paseo-ipfs.polkadot.io/ipfs",
    ss58Prefix: 0,
  },
} as const;

export type ChainId = keyof typeof CHAINS;
