import { deriveEntropy } from "@parity/product-sdk/host";
import { toHex } from "polkadot-api/utils";
import type { TestDefinition } from "@/lib/types";
import { error, sdkErrorMessage, success } from "./shared";

export const entropyTests: TestDefinition[] = [
  {
    id: "derive-entropy",
    name: "Derive Entropy",
    description: "Derives deterministic 32-byte entropy from a key (RFC-0007)",
    api: "deriveEntropy(key)",
    args: [
      {
        name: "key",
        label: "Key (text)",
        defaultValue: "my-secret-key",
      },
    ],
    category: "entropy",
    async run({ args }) {
      const key = new TextEncoder().encode(args.key);

      try {
        const result = await deriveEntropy(key);
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        const entropy = result.value;
        return success(`Derived ${entropy.length} bytes of entropy`, {
          entropyHex: toHex(entropy),
        });
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        return error(e.message, e);
      }
    },
  },
];
