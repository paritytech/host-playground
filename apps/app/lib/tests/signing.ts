import { Binary } from "polkadot-api";
import { toHex } from "polkadot-api/utils";
import { getApp } from "@/lib/app";
import type { TestDefinition, TestResult } from "@/lib/types";
import {
  accounts,
  error,
  getClient,
  PEOPLE_CHAIN_BY_HUB,
  prepareSimpleStoreWrite,
  sdkErrorMessage,
  SIMPLE_STORE_ADDRESS,
  READ_ORIGIN,
  SELF_DOTNS,
  success,
  watchTx,
} from "./shared";

export const signingTests: TestDefinition[] = [
  {
    id: "wallet-sign-message",
    name: "Sign Raw Message",
    description:
      "Signs an arbitrary raw message through the product-sdk umbrella's app.wallet — connects on demand if no accounts are present, then app.wallet.signMessage. This is the Tier-1 createApp wallet path: raw-message signing with the connected product account (replaces the old getProductAccountSigner().signBytes card).",
    api: "app.wallet.connect() / app.wallet.signMessage(message)",
    args: [
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from app.wallet!",
      },
    ],
    category: "signing",
    async run({ log, args }) {
      const messageBytes = new TextEncoder().encode(args.message);

      const app = await getApp();
      if (app.wallet.getAccounts().length === 0) {
        log("No wallet accounts yet — connecting...");
        await app.wallet.connect();
      }
      log("Signing message via app.wallet.signMessage...");
      const sig = await app.wallet.signMessage(messageBytes);

      return success("Message signed via app.wallet", {
        signature: toHex(sig),
      });
    },
  },
  {
    id: "sign-raw-legacy",
    name: "Sign Raw with DotNS Identity",
    description:
      "Signs a raw message with the account that owns the logged-in user's DotNS identity, via app.wallet.signMessageWithDotNsIdentity — the SDK resolves the primary username on the paired People/Individuality chain and signs with its owner.",
    api: "app.wallet.signMessageWithDotNsIdentity({ peopleChain, message })",
    args: [
      {
        name: "message",
        label: "Message",
        defaultValue: "Hello from a DotNS identity!",
      },
    ],
    category: "signing",
    async run({ chain, log, args }) {
      // Pick the People chain from the selected hub — no hardcoded descriptor.
      const peopleChain = PEOPLE_CHAIN_BY_HUB[chain.genesis];
      if (!peopleChain) {
        return error(
          `No People-chain descriptor for ${chain.name} — DotNS identity signing is available on the Paseo hubs.`,
        );
      }

      const app = await getApp();
      log("Resolving primary DotNS username + signing on the People chain...");
      const signed = await app.wallet.signMessageWithDotNsIdentity({
        peopleChain,
        message: args.message,
      });

      return success(`Message signed as ${signed.username}`, {
        username: signed.username,
        accountId: signed.accountId,
        signature: toHex(signed.signature),
        signatureLength: signed.signature.length,
      });
    },
  },
  {
    id: "create-transaction",
    name: "Create Transaction with Product Account",
    description:
      "Signs a transaction offline via the product account signer (mode = createTransaction). Returns the signed bytes without broadcasting.",
    api: "tx.sign(accountsProvider.getProductAccountSigner(account))",
    args: [
      {
        name: "dotNsIdentifier",
        label: "DotNS ID",
        defaultValue: SELF_DOTNS,
      },
      {
        name: "message",
        label: "Remark",
        defaultValue: "Create Transaction from Host Playground",
      },
    ],
    category: "signing",
    async run({ chain, log, args }) {
      log(`Fetching product account for ${args.dotNsIdentifier}...`);
      const accountsProvider = await accounts();
      const accountResult = await accountsProvider.getProductAccount(
        args.dotNsIdentifier,
        0,
      );
      const account = accountResult.match(
        (a) => a,
        (err) => {
          log(`getProductAccount failed: ${sdkErrorMessage(err)}`);
          return null;
        },
      );
      if (!account) {
        return error(
          `No product account for "${args.dotNsIdentifier}" — check that the user is signed in and the DotNS ID is valid`,
        );
      }

      // Product account signers route through the host's createTransaction path.
      const signer = accountsProvider.getProductAccountSigner(account);

      const client = await getClient(chain.genesis);
      const api = client.getUnsafeApi();
      const tx = api.tx.System.remark({
        remark: Binary.fromText(args.message),
      });

      log("Signing (createTransaction mode)...");
      try {
        const signedBytes = await tx.sign(signer);
        const signedHex = toHex(signedBytes);
        return success(`Transaction signed (${signedBytes.length} bytes)`, {
          preview: `${signedHex.slice(0, 80)}...`,
          length: signedBytes.length,
        });
      } catch (err) {
        const message = sdkErrorMessage(err);
        const outcome =
          /NotSupported|does not declare VerifyMultiSignature/.test(message)
            ? "unsupported"
            : "failed";
        return error(message, err, outcome);
      }
    },
  },
  {
    id: "sign-batch-payload",
    name: "Sign & Submit Batch (2 contract writes)",
    description:
      "Batches two storeValue calls on the SimpleStore contract using Utility.batch_all, signs via the createTransaction product signer, and submits atomically. All calls must be pallet-revive — mixing a System.remark in here makes the batch fail because the AsPgas fee route only applies to revive calls.",
    api: "api.tx.Utility.batch_all([storeValue, storeValue]).signSubmitAndWatch(signer)",
    category: "signing",
    async run({ chain, log }): Promise<TestResult> {
      const write = await prepareSimpleStoreWrite(chain, log);
      if (!write.ok) return write.result;
      const { contract, origin, signer } = write;

      const client = await getClient(chain.genesis);
      const api = client.getUnsafeApi();

      log("Building 2 contract calls...");

      // The first transaction from a fresh product account establishes its
      // Revive mapping. Estimate the call with the deployed read origin so the
      // dry-run does not reject that still-unmapped product account; the
      // decoded calls remain origin-independent and are submitted by `signer`.
      const dryRun1 = await contract.query("storeValue", {
        origin: READ_ORIGIN,
        data: { _value: BigInt(42) },
      });
      if (!dryRun1.success) return error("Dry-run #1 failed", dryRun1.value);
      const dryRun2 = await contract.query("storeValue", {
        origin: READ_ORIGIN,
        data: { _value: BigInt(43) },
      });
      if (!dryRun2.success) return error("Dry-run #2 failed", dryRun2.value);
      const storeCall1 = await dryRun1.value.send().decodedCall;
      const storeCall2 = await dryRun2.value.send().decodedCall;

      log("Submitting Utility.batch_all of 2 calls...");
      const batchTx = api.tx.Utility.batch_all({
        calls: [storeCall1, storeCall2],
      });

      const finalized = await watchTx(
        batchTx.signSubmitAndWatch(signer),
        log,
        "finalized",
      );

      return success(`Batch finalized on ${chain.name}`, {
        txHash: finalized.txHash,
        contract: SIMPLE_STORE_ADDRESS,
        calls: ["Revive.call (storeValue=42)", "Revive.call (storeValue=43)"],
      });
    },
  },
];
