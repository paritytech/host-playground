import { Binary, createClient, type PolkadotClient } from "polkadot-api";
import { getPolkadotSigner } from "polkadot-api/signer";
import { getWsProvider } from "polkadot-api/ws";
import { sr25519CreateDerive } from "@polkadot-labs/hdkd";
import {
  DEV_PHRASE,
  entropyToMiniSecret,
  mnemonicToEntropy,
  ss58Address,
} from "@polkadot-labs/hdkd-helpers";

export type NetworkKey = "paseo-next-v2" | "previewnet";

/** Matches the `ChainId` keys of `NETWORKS` in apps/app/lib/types.ts. */
export type ChainId = "PASEO_ASSETHUBNEXTV2" | "PREVIEWNET_ASSETHUB";

export interface NetworkConfig {
  name: string;
  chainId: ChainId;
  ethRpc: string;
  wsUrl: string;
  genesis: `0x${string}`;
  ss58Prefix: number;
  faucet: string;
}

/** Keep in sync with `NETWORKS` in apps/app/lib/types.ts. */
export const NETWORKS: Record<NetworkKey, NetworkConfig> = {
  "paseo-next-v2": {
    name: "Paseo Next v2 Hub",
    chainId: "PASEO_ASSETHUBNEXTV2",
    ethRpc: "https://eth-rpc-paseo-next.polkadot.io",
    wsUrl: "wss://paseo-asset-hub-next-rpc.polkadot.io",
    genesis:
      "0x23e730eb1c6fecae09c917439a5038cb6122d0d48980e8b9bbf0ff56f94a2ca6",
    ss58Prefix: 0,
    faucet: "https://faucet.polkadot.io/?parachain=1500",
  },
  previewnet: {
    name: "Previewnet Hub",
    chainId: "PREVIEWNET_ASSETHUB",
    ethRpc: "https://previewnet.substrate.dev/eth-rpc",
    wsUrl: "wss://previewnet.substrate.dev/asset-hub",
    genesis:
      "0x4d11c803cc6921429e3876638977ad006ea1bba8cd3976a0bca2f164e7026210",
    ss58Prefix: 0,
    faucet: "https://faucet.polkadot.io/",
  },
};

export function getNetwork(): { key: NetworkKey; config: NetworkConfig } {
  const key = (process.env.NETWORK ?? process.argv[2]) as NetworkKey;
  if (!key || !(key in NETWORKS)) {
    console.error(`Set NETWORK to one of: ${Object.keys(NETWORKS).join(", ")}.`);
    process.exit(1);
  }
  return { key, config: NETWORKS[key] };
}

/**
 * The deploying account. Defaults to the well-known `//Bob` dev seed: these are
 * public testnets whose dev accounts are pre-funded, so no secret is involved.
 */
export function getDeployer(config: NetworkConfig) {
  const suri = process.env.DEPLOYER_SEED ?? "//Bob";
  const miniSecret = entropyToMiniSecret(mnemonicToEntropy(DEV_PHRASE));
  const derive = sr25519CreateDerive(miniSecret);
  const keypair = derive(suri);
  return {
    suri,
    address: ss58Address(keypair.publicKey, config.ss58Prefix),
    signer: getPolkadotSigner(keypair.publicKey, "Sr25519", keypair.sign),
  };
}

/** True when `address` holds contract code on this network. */
export async function hasCode(
  config: NetworkConfig,
  address: string,
): Promise<boolean> {
  const res = await fetch(config.ethRpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getCode",
      params: [address, "latest"],
    }),
  });
  const json = (await res.json()) as { result?: string; error?: unknown };
  if (json.error) throw new Error(`eth_getCode failed: ${JSON.stringify(json.error)}`);
  return Boolean(json.result) && json.result !== "0x";
}

export function connect(config: NetworkConfig): PolkadotClient {
  return createClient(getWsProvider(config.wsUrl));
}

/**
 * Aborts with the address to top up rather than letting the deploy fail deep in
 * a dry-run, which reports the shortfall as an opaque module error.
 */
async function assertFunded(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any,
  config: NetworkConfig,
  deployer: ReturnType<typeof getDeployer>,
): Promise<void> {
  const account = await api.query.System.Account.getValue(deployer.address);
  const free: bigint = account.data.free;
  console.log(`Deployer: ${deployer.address} (${deployer.suri})`);
  console.log(`Balance:  ${free}`);
  if (free > 0n) return;

  console.error(
    [
      "",
      `Deployer has no funds on ${config.name}.`,
      "",
      `  Address  ${deployer.address}   (SS58 prefix ${config.ss58Prefix})`,
      `  Seed     ${deployer.suri}`,
      `  Balance  0`,
      "",
      `  Top this account up, then re-run:`,
      `  ${config.faucet}`,
      "",
    ].join("\n"),
  );
  process.exit(1);
}

/** The slice of `ReviveApi.instantiate`'s return that the deploy path reads. */
interface InstantiateDryRun {
  weight_required: { ref_time: bigint; proof_size: bigint };
  storage_deposit: { type: "Charge" | "Refund"; value: bigint };
  result: { success: boolean; value: { addr?: unknown } };
}

/** H160s arrive as a plain hex string from runtime APIs and as a Binary from events. */
function toHex(value: unknown): `0x${string}` | undefined {
  if (typeof value === "string" && value.startsWith("0x")) {
    return value as `0x${string}`;
  }
  const asHex = (value as { asHex?: () => string } | undefined)?.asHex;
  return typeof asHex === "function"
    ? (asHex.call(value) as `0x${string}`)
    : undefined;
}

/** Retries `fn`, which must be safe to repeat — every caller here is a dry-run or a fresh deploy. */
export async function withRetry<T>(
  label: string,
  attempts: number,
  fn: () => Promise<T>,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`${label}: attempt ${attempt}/${attempts} failed — ${message}`);
      if (attempt < attempts) {
        const backoffMs = 2000 * attempt;
        console.warn(`${label}: retrying in ${backoffMs}ms…`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }
  throw lastError;
}

/**
 * Deploys `bytecode` via pallet-revive and returns the contract's H160. The
 * weight and storage-deposit limits come from a dry run, doubled: an estimate
 * taken one block before submission can be short by the time it lands.
 */
export async function deploy(
  config: NetworkConfig,
  bytecode: `0x${string}`,
  attempts = 3,
): Promise<`0x${string}`> {
  const deployer = getDeployer(config);
  const client = connect(config);
  try {
    const api = client.getUnsafeApi();
    await assertFunded(api, config, deployer);

    const code = Binary.fromHex(bytecode);
    const data = Binary.fromHex("0x");

    // Only the submission is retried. Everything after it inspects a deploy that
    // already landed, so a flaky read must never trigger a second one.
    const submitted = await withRetry("deploy", attempts, async () => {
      const dry = (await api.apis.ReviveApi.instantiate(
        deployer.address,
        0n,
        undefined,
        undefined,
        { type: "Upload", value: code },
        data,
        undefined,
      )) as InstantiateDryRun;
      if (!dry.result.success) {
        throw new Error(`dry run reverted: ${JSON.stringify(dry.result.value)}`);
      }

      const deposit =
        dry.storage_deposit.type === "Charge" ? dry.storage_deposit.value : 0n;
      const weight = dry.weight_required;
      console.log(`Storage deposit: ${deposit}`);

      const result = await api.tx.Revive.instantiate_with_code({
        value: 0n,
        weight_limit: {
          ref_time: weight.ref_time * 2n,
          proof_size: weight.proof_size * 2n,
        },
        storage_deposit_limit: deposit * 2n,
        code,
        data,
        salt: undefined,
      }).signAndSubmit(deployer.signer);

      if (!result.ok) {
        throw new Error(`extrinsic failed: ${JSON.stringify(result.dispatchError)}`);
      }
      return { result, predicted: toHex(dry.result.value.addr) };
    });

    const { result, predicted } = submitted;
    console.log(`Tx: ${result.txHash}`);

    const event = result.events.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) => e.type === "Revive" && e.value?.type === "Instantiated",
    );
    // The event is authoritative; the dry run's prediction only holds if the
    // deployer's nonce did not move in between.
    const address = toHex(event?.value?.value?.contract) ?? predicted;
    if (!address) {
      throw new Error(
        `deployed in ${result.txHash} but could not read the address back — ` +
          `check the Revive.Instantiated event for that extrinsic`,
      );
    }
    const live = await withRetry("verify", 3, () => hasCode(config, address));
    if (!live) {
      throw new Error(`no code at ${address} after deploying in ${result.txHash}`);
    }
    return address;
  } finally {
    client.destroy();
  }
}
