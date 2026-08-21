import { findRingVrfKeyHandle } from "@parity/product-sdk/host";
import { toHex } from "polkadot-api/utils";
import type { TestDefinition } from "@/lib/types";
import {
  accounts,
  error,
  PRODUCT_ALIAS_CONTEXT_SUFFIX,
  PRODUCT_ALIAS_RING_LOCATION,
  PRODUCT_ALIAS_RING_OWNER,
  sdkErrorMessage,
  SELF_DOTNS,
  success,
} from "./shared";

export const accountTests: TestDefinition[] = [
  {
    id: "accounts-provider-product",
    name: "Get Product Account",
    description: "Gets a product account via getAccountsProvider",
    api: "accountsProvider.getProductAccount(dotNsIdentifier)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
    ],
    category: "accounts",
    async run({ args }) {
      const accountsProvider = await accounts();
      const result = await accountsProvider.getProductAccount(
        args.dotNsIdentifier,
      );

      return result.match(
        (account) =>
          success("Product account:", {
            publicKey: toHex(account.publicKey),
          }),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-legacy",
    name: "Get Legacy Accounts",
    description: "Gets legacy accounts via getAccountsProvider",
    api: "accountsProvider.getLegacyAccounts()",
    category: "accounts",
    async run() {
      const accountsProvider = await accounts();
      const result = await accountsProvider.getLegacyAccounts();

      return result.match(
        (legacyAccounts) =>
          success(
            "Legacy accounts:",
            legacyAccounts.map((account) => ({
              name: account.name,
              publicKey: toHex(account.publicKey),
            })),
          ),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-alias",
    name: "Get Product Account Alias",
    description:
      "Selects the personhood product's registered People Lite key and gets this product's contextual alias",
    api: "accountsProvider.listRingVrfKeys(owner) → getProductAccountAlias(keyHandle, context, ringLocation)",
    category: "accounts",
    async run() {
      const accountsProvider = await accounts();
      const listed = await accountsProvider
        .listRingVrfKeys(PRODUCT_ALIAS_RING_OWNER)
        .match(
          (keys) => ({
            ok: true as const,
            keyHandle: findRingVrfKeyHandle(keys, PRODUCT_ALIAS_RING_LOCATION),
          }),
          (err) => ({
            ok: false as const,
            result: error(sdkErrorMessage(err), err),
          }),
        );
      if (!listed.ok) return listed.result;
      if (!listed.keyHandle) {
        return error(
          `No ${PRODUCT_ALIAS_RING_OWNER} key is registered for the People Lite ring`,
        );
      }
      const result = await accountsProvider.getProductAccountAlias(
        listed.keyHandle,
        { productId: SELF_DOTNS, suffix: PRODUCT_ALIAS_CONTEXT_SUFFIX },
        PRODUCT_ALIAS_RING_LOCATION,
      );

      return result.match(
        (alias) =>
          success("Account alias retrieved", {
            context: toHex(alias.context),
            alias: toHex(alias.alias),
          }),
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-product-signer",
    name: "Product Account Signer",
    description: "Creates a PolkadotSigner for a product account",
    api: "accountsProvider.getProductAccountSigner(account)",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
    ],
    category: "accounts",
    async run({ args }) {
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        args.dotNsIdentifier,
      );

      return accountResult.match(
        (account) => {
          const signer = accountsProvider.getProductAccountSigner(account);
          return success("Product account signer created", {
            publicKey: toHex(signer.publicKey),
          });
        },
        (err) => error(sdkErrorMessage(err), err),
      );
    },
  },
  {
    id: "accounts-provider-connection-status",
    name: "Account Connection Status",
    description: "Subscribes to account connection status changes (5s)",
    api: "accountsProvider.subscribeAccountConnectionStatus(callback)",
    category: "accounts",
    async run() {
      const accountsProvider = await accounts();

      return new Promise((resolve) => {
        const statuses: string[] = [];
        const subscription = accountsProvider.subscribeAccountConnectionStatus(
          (status) => {
            statuses.push(status);
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(`Received ${statuses.length} status updates`, statuses),
          );
        }, 5000);
      });
    },
  },
];
