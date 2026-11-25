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
  | "locale"
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
  bulletinGenesis?: `0x${string}`;
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
      "0x4349b00e54897e21196fd331015fc5be0f14e118beb0375ed2bb1793737bb57a" as const,
    wsUrl: "wss://paseo-asset-hub-next-rpc.polkadot.io",
    ss58Prefix: 0,
    dotNsSuffix: "paseo",
    peopleWsUrl: "wss://paseo-people-next-system-rpc.polkadot.io",
    peopleGenesis:
      "0x4a2b5b737de1da59e209b0000a876ec2fa20035dc34fd292a848da32d255ad48" as const,
    personhoodRingOwner: "peopl.paseo",
    bulletinWsUrl: "wss://paseo-bulletin-next-rpc.polkadot.io",
    bulletinGenesis:
      "0x8cfe6717dc4becfda2e13c488a1e2061ff2dfee96e7d031157f72d36716c0a22" as const,
  },
  PREVIEWNET_ASSETHUB: {
    name: "Previewnet Hub",
    network: "Testnet",
    genesis:
      "0xf7d88e2e343e911c9a5c1a7e6ed53d06ef4cd73276fc3afff87062a1f6f90514" as const,
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
    ss58Prefix: 0,
    dotNsSuffix: "testnet",
    peopleWsUrl: "wss://previewnet.substrate.dev/people",
    peopleGenesis:
      "0x732abb4e3052154ebd9201a375b0aacf2d1fe7015700235c0a8b30d44b401c19" as const,
    personhoodRingOwner: "peopl.dot",
    bulletinWsUrl: "wss://previewnet.substrate.dev/bulletin",
    bulletinGenesis:
      "0x1c0a1c27946ca0e7def02955315633db590bc38b0c537936e423efeb6c554876" as const,
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
