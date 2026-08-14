import type { TestCategory, TestDefinition } from "@/lib/types";
import { accountTests } from "./accounts";
import { allowancesTests } from "./allowances";
import { authTests } from "./auth";
import { chainTests } from "./chain";
import { contractTests } from "./contract";
import { entropyTests } from "./entropy";
import { extensionTests } from "./extension";
import { navigationTests } from "./navigation";
import { notificationTests } from "./notifications";
import { paymentTests } from "./payments";
import { permissionTests } from "./permissions";
import { preimageTests } from "./preimage";
import { signingTests } from "./signing";
import { statementTests } from "./statements";
import { storageTests } from "./storage";
import { themeTests } from "./theme";

/** Every card in the playground. The Record type keeps a category from going missing. */
export const testsByCategory: Record<TestCategory, TestDefinition[]> = {
  accounts: accountTests,
  signing: signingTests,
  extension: extensionTests,
  storage: storageTests,
  permissions: permissionTests,
  statements: statementTests,
  preimage: preimageTests,
  notifications: notificationTests,
  navigation: navigationTests,
  chain: chainTests,
  contract: contractTests,
  theme: themeTests,
  entropy: entropyTests,
  auth: authTests,
  payments: paymentTests,
  allowances: allowancesTests,
};

/** Resolves a test's declared arg defaults, so `run` never sees a missing arg. */
export async function resolveTestArgs(
  test: TestDefinition,
  provided: Record<string, string> = {},
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    (test.args ?? []).map(async (arg) => {
      const supplied = provided[arg.name];
      if (supplied !== undefined) return [arg.name, supplied] as const;
      const fallback =
        typeof arg.defaultValue === "string"
          ? arg.defaultValue
          : await arg.defaultValue();
      return [arg.name, fallback] as const;
    }),
  );
  return Object.fromEntries(entries);
}
