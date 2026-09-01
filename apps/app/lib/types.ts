export type LogStatus = "success" | "error" | "info" | "pending";
export type TestOutcome =
  | "supported"
  | "unavailable"
  | "permission-denied"
  | "unsupported"
  | "precondition-missing"
  | "failed";

export interface LogEntry {
  id: string;
  timestamp: Date;
  action: string;
  status: LogStatus;
  message: string;
  details?: string;
  outcome?: TestOutcome;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: unknown;
  outcome?: TestOutcome;
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
  dotNsSuffix: string;
  papiNetworkId?: string;
  peopleWsUrl?: string;
  peopleGenesis?: `0x${string}`;
  personhoodRingOwner?: string;
  peopleNetworkId?: string;
  bulletinWsUrl?: string;
}

export interface TestArg {
  name: string;
  label: string;
  defaultValue: string | (() => Promise<string>);
}

/** Everything a test's `run` is handed. The runner always fills every field. */
export interface TestContext {
  chain: ChainConfig;
  log: TestLogger;
  /** Declared args with their `defaultValue` already resolved and applied. */
  args: Record<string, string>;
  /** Client-side navigation, for the tests that exercise in-app routing. */
  navigate: (path: string) => void;
}

export interface TestDefinition {
  id: string;
  name: string;
  description: string;
  api: string;
  args?: TestArg[];
  warning?: string;
  disabled?: string;
  /** Overrides the runner's default 30s cap — for live chain writes that wait on block inclusion. */
  timeoutMs?: number;
  category: TestCategory;
  run: (ctx: TestContext) => Promise<TestResult>;
}

export const NETWORKS = {
  PASEO_ASSETHUBNEXTV2: {
    name: "Paseo Next v2 Hub",
    network: "Testnet",
    genesis:
      "0x23e730eb1c6fecae09c917439a5038cb6122d0d48980e8b9bbf0ff56f94a2ca6" as const,
    wsUrl: "wss://paseo-asset-hub-next-rpc.polkadot.io",
    ss58Prefix: 0,
    dotNsSuffix: "paseo",
    peopleWsUrl: "wss://paseo-people-next-system-rpc.polkadot.io",
    peopleGenesis:
      "0x89a63b11fef2c0273fc72c0d864da0793a665dade5db153e0cab995348c5440f" as const,
    personhoodRingOwner: "peopl.paseo",
    bulletinWsUrl: "wss://paseo-bulletin-next-rpc.polkadot.io",
  },
  PREVIEWNET_ASSETHUB: {
    name: "Previewnet Hub",
    network: "Testnet",
    genesis:
      "0x4d11c803cc6921429e3876638977ad006ea1bba8cd3976a0bca2f164e7026210" as const,
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
    ss58Prefix: 0,
    dotNsSuffix: "testnet",
    peopleWsUrl: "wss://previewnet.substrate.dev/people",
    peopleGenesis:
      "0x3138c6d4ce58c760047a413c2a930e919b4673a841ab4890de59aac3bd037f3d" as const,
    personhoodRingOwner: "peopl.dot",
    bulletinWsUrl: "wss://previewnet.substrate.dev/bulletin",
  },
} as const;

export type ChainId = keyof typeof NETWORKS;

const CHAIN_ID_BY_GENESIS = Object.fromEntries(
  (Object.keys(NETWORKS) as ChainId[]).map((id) => [NETWORKS[id].genesis, id]),
) as Record<string, ChainId>;

export const ACTIVE_CHAIN_ID: ChainId =
  CHAIN_ID_BY_GENESIS[process.env.NEXT_PUBLIC_NETWORK_GENESIS_HASH ?? ""] ??
  "PREVIEWNET_ASSETHUB";

export const ACTIVE_CHAIN: ChainConfig = NETWORKS[ACTIVE_CHAIN_ID];
