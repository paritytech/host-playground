import { toHex } from "polkadot-api/utils";
import type { TestDefinition, TestResult } from "@/lib/types";
import { error, success } from "./shared";

// The hooks only make sense in the browser. The harness and use-truapi load
// on first run instead of with the page.
const truapi = () =>
  Promise.all([import("@/lib/truapi"), import("@use-truapi/react")]).then(
    ([harness, hooks]) => ({ ...harness, ...hooks }),
  );

async function guard(body: () => Promise<TestResult>): Promise<TestResult> {
  try {
    return await body();
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    return error(e.message, e);
  }
}

// Settles a TanStack query result. It yields the data once the query succeeds
// and throws once it fails.
function settled<D>(result: {
  isSuccess: boolean;
  isError: boolean;
  data: D | undefined;
  error: Error | null;
}): { data: D } | undefined {
  if (result.isError) throw result.error;
  return result.isSuccess ? { data: result.data as D } : undefined;
}

/** Connects the shared signer and returns the selected product account. */
async function connectedAccount() {
  const { withHook, useAccounts } = await truapi();
  return withHook(useAccounts, async (hook) => {
    const { selectedAccount, connect } = hook.current();
    if (!selectedAccount) await connect();
    return hook.waitFor((a) => a.selectedAccount ?? undefined);
  });
}

export const useTruapiTests: TestDefinition[] = [
  {
    id: "truapi-host-mode",
    name: "Host Mode",
    description: "Detects that the app runs inside a host",
    api: "useHostMode()",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useHostMode } = await truapi();
        const mode = await withHook(useHostMode, (hook) =>
          hook.waitFor((m) => (m === "unknown" ? undefined : m)),
        );
        return mode === "host"
          ? success("Detected host mode", { mode })
          : error(`Expected "host", got "${mode}"`, { mode });
      });
    },
  },
  {
    id: "truapi-host-info",
    name: "Host Info",
    description: "Reads the host's name, version, and platform",
    api: "useHostInfo()",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useHostInfo } = await truapi();
        const { data } = await withHook(
          () => useHostInfo(),
          (hook) => hook.waitFor(settled),
        );
        return data
          ? success(`Host ${data.name} ${data.version}`, data)
          : error("Host does not report host_info", null, "unsupported");
      });
    },
  },
  {
    id: "truapi-theme",
    name: "Theme",
    description: "Reads the live host theme",
    api: "useTheme()",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useTheme } = await truapi();
        const theme = await withHook(useTheme, (hook) =>
          hook.waitFor((t) => (t.source === "host" ? t : undefined)),
        );
        return success(`Host theme is ${theme.variant}`, theme);
      });
    },
  },
  {
    id: "truapi-locale",
    name: "Locale",
    description: "Reads the live host language",
    api: "useLocale()",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useLocale } = await truapi();
        const locale = await withHook(useLocale, (hook) =>
          hook.waitFor((l) => (l.source === "host" ? l : undefined)),
        );
        return success(`Host locale is ${locale.languageTag}`, locale);
      });
    },
  },
  {
    id: "truapi-accounts",
    name: "Connect Accounts",
    description: "Connects the signer and selects the product account",
    api: "useAccounts().connect()",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const account = await connectedAccount();
        return success(`Selected ${account.address}`, {
          address: account.address,
          name: account.name,
        });
      });
    },
  },
  {
    id: "truapi-chain-spec",
    name: "Chain Spec",
    description: "Reads the asset hub chain spec through the host",
    api: "useChainSpec()",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useChainSpec } = await truapi();
        const { data } = await withHook(
          () => useChainSpec(),
          (hook) => hook.waitFor(settled),
        );
        return data
          ? success("Read chain spec", data)
          : error("Host returned no chain spec", null, "unsupported");
      });
    },
  },
  {
    id: "truapi-block-number",
    name: "Block Number",
    description: "Follows the asset hub best block through the host provider",
    api: "useBlockNumber()",
    category: "use-truapi",
    timeoutMs: 60_000,
    async run() {
      return guard(async () => {
        const { withHook, useBlockNumber } = await truapi();
        const { data } = await withHook(
          () => useBlockNumber(),
          (hook) => hook.waitFor(settled, 50_000),
        );
        return data > 0
          ? success(`Best block #${data}`, { blockNumber: data })
          : error(`Unexpected block number ${data}`);
      });
    },
  },
  {
    id: "truapi-balance",
    name: "Balance",
    description: "Watches the product account's native balance",
    api: "useBalance(address)",
    category: "use-truapi",
    timeoutMs: 60_000,
    async run() {
      return guard(async () => {
        const { address } = await connectedAccount();
        const { withHook, useBalance } = await truapi();
        const { data } = await withHook(
          () => useBalance(address),
          (hook) => hook.waitFor(settled, 50_000),
        );
        return success(`Free balance ${data.free} planck`, {
          address,
          free: data.free.toString(),
          reserved: data.reserved.toString(),
          frozen: data.frozen.toString(),
        });
      });
    },
  },
  {
    id: "truapi-sign-raw",
    name: "Sign Raw",
    description: "Signs bytes with the product account",
    api: "useSignRaw().sign(data)",
    args: [{ name: "message", label: "Message", defaultValue: "hello truapi" }],
    category: "use-truapi",
    async run({ args }) {
      return guard(async () => {
        await connectedAccount();
        const { withHook, useSignRaw } = await truapi();
        const signature = await withHook(
          () => useSignRaw(),
          (hook) => hook.current().sign(new TextEncoder().encode(args.message)),
        );
        return success(`Signed ${signature.length} bytes`, {
          signature: toHex(signature),
        });
      });
    },
  },
  {
    id: "truapi-host-storage",
    name: "Host Storage",
    description: "Writes a JSON value and reads it back live",
    api: 'useHostStorage("truapi-probe").set(value)',
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useHostStorage } = await truapi();
        const written = { at: Date.now() };
        const read = await withHook(
          () => useHostStorage<typeof written>("truapi-probe"),
          async (hook) => {
            await hook.current().set(written);
            return hook.waitFor((s) =>
              s.data?.at === written.at ? s.data : undefined,
            );
          },
        );
        return success("Read back the written value", read);
      });
    },
  },
  {
    id: "truapi-entropy",
    name: "Derive Entropy",
    description: "Derives deterministic entropy, twice, and compares (RFC-0007)",
    api: "useDeriveEntropy().derive(key)",
    category: "use-truapi",
    async run() {
      return guard(async () => {
        const { withHook, useDeriveEntropy } = await truapi();
        const key = new TextEncoder().encode("truapi-entropy");
        const [first, second] = await withHook(
          () => useDeriveEntropy(),
          async (hook) => [
            await hook.current().derive(key),
            await hook.current().derive(key),
          ],
        );
        return toHex(first) === toHex(second)
          ? success(`Derived ${first.length} stable bytes`, {
              entropy: toHex(first),
            })
          : error("Entropy differed between calls", {
              first: toHex(first),
              second: toHex(second),
            });
      });
    },
  },
];
