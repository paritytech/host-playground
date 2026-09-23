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
      "0xc27c8bf3f13f96dc2130cd2b0a3debe57618fd02521ecc1902bd7dd4ed83d2fe" as const,
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
    ss58Prefix: 0,
    dotNsSuffix: "testnet",
    peopleWsUrl: "wss://previewnet.substrate.dev/people",
    peopleGenesis:
      "0xf720c28fe3315e67fa799a616fc59abad47dd257b1a336af6538435844d35218" as const,
    personhoodRingOwner: "peopl.dot",
    bulletinWsUrl: "wss://previewnet.substrate.dev/bulletin",
    bulletinGenesis:
      "0xa081192b90c1f6a3f8e9ce7b2a8246f41af805c66456c84e05fd97c2b3502425" as const,
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
