import type { TestDefinition } from "@/lib/types";
import { accounts, error, sdkErrorMessage, success } from "./shared";

export const authTests: TestDefinition[] = [
  {
    id: "request-login",
    name: "Request Login",
    description: "Triggers the host login flow (RFC-0009)",
    api: "accountsProvider.requestLogin(reason)",
    args: [
      {
        name: "reason",
        label: "Reason",
        defaultValue: "Please sign in to use this feature",
      },
    ],
    category: "auth",
    async run({ args }) {
      const accountsProvider = await accounts();
      const result = await accountsProvider.requestLogin(args.reason);

      return result.match(
        (loginResult) => success(`Login result: ${loginResult}`),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "get-user-id",
    name: "Get User Identity",
    description: "Gets the user's identity (RFC-0014)",
    api: "accountsProvider.getUserId()",
    category: "auth",
    async run() {
      const accountsProvider = await accounts();
      const result = await accountsProvider.getUserId();

      return result.match(
        (account) => success("User identity", { ...account }),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
];
