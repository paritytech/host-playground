import {
  broadcastTransaction,
  getChainSpec,
  stopTransaction,
} from "@parity/product-sdk/host";
import { AccountId } from "polkadot-api";
import type { ChainConfig, TestDefinition, TestResult } from "@/lib/types";
import {
  accounts,
  error,
  getClient,
  productSigner,
  sdkErrorMessage,
  SELF_DOTNS,
  success,
} from "./shared";

/** Reads one field off the chain spec, reporting host errors verbatim. */
async function reportChainSpec(
  chain: ChainConfig,
  label: string,
  field: "genesisHash" | "name" | "propertiesRaw",
): Promise<TestResult> {
  try {
    const result = await getChainSpec(chain.genesis);
    if (!result.ok) return error(sdkErrorMessage(result.error), result.error);
    return success(`${label}: ${result.value?.[field]}`);
  } catch (err) {
    const e = err as { name?: string };
    return error(e.name ?? String(err), err);
  }
}

/** A transaction the chain is guaranteed to reject, for broadcast plumbing. */
const INVALID_TX = "0x00" as `0x${string}`;

export const chainTests: TestDefinition[] = [
  {
    id: "chain-spec-genesis-hash",
    name: "Chain Spec: Genesis Hash",
    description:
      "Gets the genesis hash for a chain via the typed chain interaction protocol",
    api: "getChainSpec(genesisHash).genesisHash",
    category: "chain",
    async run({ chain }) {
      return reportChainSpec(chain, "Genesis hash", "genesisHash");
    },
  },
  {
    id: "chain-spec-chain-name",
    name: "Chain Spec: Chain Name",
    description: "Gets the chain name via the typed chain interaction protocol",
    api: "getChainSpec(genesisHash).name",
    category: "chain",
    async run({ chain }) {
      return reportChainSpec(chain, "Chain name", "name");
    },
  },
  {
    id: "chain-spec-properties",
    name: "Chain Spec: Properties",
    description:
      "Gets chain properties (token symbol, decimals, etc.) via the typed protocol",
    api: "getChainSpec(genesisHash).propertiesRaw",
    category: "chain",
    async run({ chain }) {
      return reportChainSpec(chain, "Properties", "propertiesRaw");
    },
  },
  {
    id: "chain-transaction-broadcast",
    name: "Transaction: Broadcast",
    description: "Broadcasts a dummy transaction (expected to fail validation)",
    api: "broadcastTransaction(genesisHash, transaction)",
    warning: "Will fail with invalid transaction",
    category: "chain",
    async run({ chain }) {
      try {
        const result = await broadcastTransaction(chain.genesis, INVALID_TX);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        const operationId = result.value;
        return operationId
          ? success(`Broadcast started, operationId: ${operationId}`)
          : success("Broadcast accepted (no operationId)");
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-transaction-stop",
    name: "Transaction: Stop",
    description: "Broadcasts a transaction then immediately stops it",
    api: "broadcastTransaction(...) then stopTransaction(genesisHash, operationId)",
    category: "chain",
    async run({ chain, log }) {
      log("Broadcasting dummy transaction...");

      let operationId: string | null;
      try {
        const result = await broadcastTransaction(chain.genesis, INVALID_TX);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        operationId = result.value;
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }

      if (!operationId)
        return success("Broadcast returned no operationId — nothing to stop");

      log(`Stopping broadcast ${operationId}...`);
      try {
        const result = await stopTransaction(chain.genesis, operationId);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        return success(`Stopped broadcast ${operationId}`);
      } catch (err) {
        const e = err as { name?: string };
        return error(e.name ?? String(err), err);
      }
    },
  },
  {
    id: "chain-query-balance",
    name: "Query Balance",
    description:
      "Queries System.Account balance. Defaults to this product's account; the field can be edited to query anyone.",
    api: "getClient(genesis) → client.getUnsafeApi().query.System.Account.getValue(address)",
    args: [
      {
        name: "address",
        label: "Address (SS58)",
        defaultValue: async () => {
          // Prefill with ss58 prefix 0 (all Paseo hubs); run() re-encodes with
          // the active chain's prefix if it differs.
          const accountsProvider = await accounts();
          const result = await accountsProvider.getProductAccount(
            SELF_DOTNS,
            0,
          );
          return result.match(
            (a) => AccountId(0).dec(a.publicKey),
            () => "",
          );
        },
      },
    ],
    category: "chain",
    async run({ chain, log, args }) {
      let address = args.address.trim();
      if (!address) {
        const product = await productSigner(log);
        if (!product) return error(`No product account for "${SELF_DOTNS}"`);
        address = AccountId(chain.ss58Prefix).dec(product.account.publicKey);
        log(`Resolved product account ${SELF_DOTNS}/0 → ${address}`);
      }
      // Stays on getClient (genesis-keyed): app.chain is descriptor-based and
      // ChainConfig carries no PAPI descriptor, so there's no clean mapping.
      const client = await getClient(chain.genesis);
      try {
        const api = client.getUnsafeApi();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const account: any = await api.query.System.Account.getValue(address);
        const free = account?.data?.free ?? 0;
        const reserved = account?.data?.reserved ?? 0;
        return success(
          `Balance for ${address.slice(0, 8)}…: free=${free}, reserved=${reserved}`,
          account,
        );
      } catch (e) {
        return error(`Failed to query balance: ${e}`);
      }
    },
  },
];
