import { deriveH160 } from "@parity/product-sdk/address";
import { fromHex, toHex } from "polkadot-api/utils";
import { withTrace } from "@/utils/with-trace";
import type { TestDefinition } from "@/lib/types";
import {
  ASSETHUB_GENESIS_TO_PEOPLE_GENESIS,
  ensureSmartContractAllowance,
  error,
  ensureRingVrfKeyHandle,
  EVM_DECIMALS,
  formatUnits,
  NATIVE_DECIMALS,
  parseUnits,
  personhoodRing,
  prepareSimpleStoreWrite,
  PRODUCT_ALIAS_CONTEXT_SUFFIX,
  productSigner,
  readSimpleStore,
  scaleBytes,
  SELF_DOTNS,
  simpleStore,
  SIMPLE_STORE_ADDRESS,
  success,
  toHexString,
  watchTx,
} from "./shared";

/** An unprovisioned host never answers createRingVRFProof, so cap the wait. */
const RING_PROOF_TIMEOUT_MS = 15_000;

export const contractTests: TestDefinition[] = [
  {
    id: "contract-query-stored-value",
    name: "Contract: Query Stored Value",
    description: "Reads getStoredValue() from the SimpleStore contract",
    api: "contract.query('getStoredValue', { origin })",
    category: "contract",
    async run({ chain }) {
      const read = await readSimpleStore(chain, "getStoredValue");
      if (!read.ok) return read.result;
      return success(`Stored value: ${read.response}`, {
        value: String(read.response),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-store-value",
    name: "Contract: Store Value",
    description:
      "Calls storeValue() on the SimpleStore contract (write operation)",
    api: "contract.send('storeValue', { origin, data: { _value } }).signSubmitAndWatch(signer)",
    timeoutMs: 90_000,
    args: [
      {
        name: "value",
        label: "Value (uint256)",
        defaultValue: "42",
      },
    ],
    category: "contract",
    async run({ chain, log, args }) {
      const write = await prepareSimpleStoreWrite(chain, log);
      if (!write.ok) return write.result;
      const { contract, origin, signer } = write;

      const value = BigInt(args.value);
      log(`Storing value ${value}...`);

      const dryRun = await contract.query("storeValue", {
        origin,
        data: { _value: value },
      });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await watchTx(dryRun.value.send().signSubmitAndWatch(signer), log);

      return success(`Stored value: ${value}`, {
        value: String(value),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-data-length",
    name: "Contract: Query Data Length",
    description: "Reads getStoredDataLength() from the SimpleStore contract",
    api: "contract.query('getStoredDataLength', { origin })",
    category: "contract",
    async run({ chain }) {
      const read = await readSimpleStore(chain, "getStoredDataLength");
      if (!read.ok) return read.result;
      return success(`Data length: ${read.response} bytes`, {
        length: String(read.response),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-balance",
    name: "Contract: Query Balance",
    description:
      "Reads getBalance() (address(this).balance) from the SimpleStore contract",
    api: "contract.query('getBalance', { origin })",
    category: "contract",
    async run({ chain }) {
      const read = await readSimpleStore(chain, "getBalance");
      if (!read.ok) return read.result;
      const wei = read.response as bigint;
      return success(
        `Contract balance: ${formatUnits(wei, EVM_DECIMALS)} PAS`,
        {
          balanceWei: String(wei),
          contract: SIMPLE_STORE_ADDRESS,
        },
      );
    },
  },
  {
    id: "contract-deposit",
    name: "Contract: Deposit",
    description:
      "Calls deposit() on the SimpleStore contract (payable write operation)",
    api: "contract.send('deposit', { origin, value: amount }).signSubmitAndWatch(signer)",
    timeoutMs: 90_000,
    args: [
      {
        name: "amount",
        label: "Amount (PAS)",
        defaultValue: "0.1",
      },
    ],
    category: "contract",
    async run({ chain, log, args }) {
      const write = await prepareSimpleStoreWrite(chain, log);
      if (!write.ok) return write.result;
      const { contract, origin, signer } = write;

      // A payable call carries a native transfer value, so planck, not wei.
      const planck = parseUnits(args.amount, NATIVE_DECIMALS);
      log(`Depositing ${args.amount} PAS (${planck} planck)...`);

      const dryRun = await contract.query("deposit", { origin, value: planck });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await watchTx(dryRun.value.send().signSubmitAndWatch(signer), log);

      return success(`Deposited ${args.amount} PAS`, {
        planck: String(planck),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-withdraw",
    name: "Contract: Withdraw",
    description:
      "Calls withdraw() on the SimpleStore contract (write operation)",
    api: "contract.send('withdraw', { origin, data: { _amount } }).signSubmitAndWatch(signer)",
    timeoutMs: 90_000,
    args: [
      {
        name: "amount",
        label: "Amount (PAS)",
        defaultValue: "0.1",
      },
    ],
    category: "contract",
    async run({ chain, log, args }) {
      const write = await prepareSimpleStoreWrite(chain, log);
      if (!write.ok) return write.result;
      const { contract, origin, signer } = write;

      // withdraw() is a plain Solidity argument, so EVM wei rather than planck.
      const wei = parseUnits(args.amount, EVM_DECIMALS);
      log(`Withdrawing ${args.amount} PAS (${wei} wei)...`);

      const dryRun = await contract.query("withdraw", {
        origin,
        data: { _amount: wei },
      });
      if (!dryRun.success) return error("Dry-run failed", dryRun.value);

      log("Signing and submitting...");
      await watchTx(dryRun.value.send().signSubmitAndWatch(signer), log);

      return success(`Withdrew ${args.amount} PAS`, {
        wei: String(wei),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-query-total-deposits",
    name: "Contract: Query Total Deposits",
    description: "Reads totalDeposits() from the SimpleStore contract",
    api: "contract.query('totalDeposits', { origin })",
    category: "contract",
    async run({ chain }) {
      const read = await readSimpleStore(chain, "totalDeposits");
      if (!read.ok) return read.result;
      return success(`Total deposits: ${read.response}`, {
        deposits: String(read.response),
        contract: SIMPLE_STORE_ADDRESS,
      });
    },
  },
  {
    id: "contract-store-value-if-person",
    name: "Contract: Store Value if Person",
    description:
      "Generates a Ring VRF personhood proof (createRingVRFProof) and calls storeValueIfPerson; the contract verifies it via the individuality precompile (0x…0a010000) and stores the value only for a verified person. NOTE: needs an individuality-provisioned network AND a host matching the app's product-sdk — otherwise createRingVRFProof times out or the proof is rejected.",
    api: "createRingVRFProof(context, location, message) → contract.send('storeValueIfPerson', { _value, request })",
    args: [
      {
        name: "value",
        label: "Value (uint256)",
        defaultValue: "7",
      },
    ],
    category: "contract",
    async run({ chain, log, args }) {
      try {
        log("Fetching product account...");
        const product = await withTrace("productSigner", productSigner(log));
        if (!product) return error("No product account available");
        const { provider, account, signer, origin } = product;

        // The contract binds the proof to `abi.encodePacked(msg.sender)` — the
        // caller's H160 — so generate the proof over that exact address.
        const message = fromHex(deriveH160(account.publicKey));

        const peopleGenesis = ASSETHUB_GENESIS_TO_PEOPLE_GENESIS[chain.genesis];
        if (!peopleGenesis) {
          return error(
            `No People chain known for ${chain.name} — the personhood rings live there.`,
          );
        }

        const ring = personhoodRing(peopleGenesis);
        const key = await ensureRingVrfKeyHandle(provider, ring);
        if (!key.ok) return key.result;

        // createRingVRFProof resolves the ring itself and returns the full
        // bundle {proof, contextualAlias, ringIndex, ringRevision}.
        log("Requesting Ring VRF personhood proof (createRingVRFProof)...");
        const proofResult = await withTrace(
          "createRingVRFProof",
          Promise.race([
            provider
              .createRingVRFProof(
                key.handle,
                { productId: SELF_DOTNS, suffix: PRODUCT_ALIAS_CONTEXT_SUFFIX },
                ring,
                message,
              )
              .match(
                (p) => ({ ok: true as const, proof: p }),
                (e) => ({ ok: false as const, reason: e.tag }),
              ),
            new Promise<{ ok: false; reason: string }>((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    ok: false,
                    reason: "timed out (host never answered)",
                  }),
                RING_PROOF_TIMEOUT_MS,
              ),
            ),
          ]),
        );
        if (!proofResult.ok) {
          return error(`createRingVRFProof ${proofResult.reason}`);
        }
        const proof = proofResult.proof;
        log(
          `Proof received (ring ${proof.ringIndex}, revision ${proof.ringRevision})`,
        );

        const allowanceError = await withTrace(
          "ensureSmartContractAllowance",
          ensureSmartContractAllowance(log, chain, account),
        );
        if (allowanceError) return allowanceError;

        const contract = await withTrace("simpleStore", simpleStore(chain));

        const value = BigInt(args.value);
        // expectedStatus 1 = Lite tier, matching the People Lite ring the
        // proof came from. `message` is overwritten with msg.sender inside
        // the contract. The alias and ring metadata come from the proof
        // bundle. The generated descriptor types the byte fields as
        // Uint8Array, but the sol ABI encoder underneath only accepts 0x hex
        // strings, so the values are hex and the cast restores the descriptor
        // shape.
        const request = {
          expectedStatus: 1,
          proof: toHexString(scaleBytes(proof.proof)),
          expectedAlias: toHexString(proof.contextualAlias.alias),
          ringIndex: proof.ringIndex,
          context: toHexString(proof.contextualAlias.context),
          revision: proof.ringRevision,
          message: toHexString(message),
        } as unknown as {
          expectedStatus: number;
          proof: Uint8Array;
          expectedAlias: Uint8Array;
          ringIndex: number;
          context: Uint8Array;
          revision: number;
          message: Uint8Array;
        };

        log("Dry-running storeValueIfPerson...");
        const dryRun = await withTrace(
          "contract.query(storeValueIfPerson)",
          contract.query("storeValueIfPerson", {
            origin,
            data: { _value: value, request },
          }),
        );
        if (!dryRun.success) {
          return error(
            "Dry-run failed — proof rejected (not a verified person?)",
            dryRun.value,
          );
        }

        log("Signing and submitting...");
        await withTrace(
          "signSubmitAndWatch",
          watchTx(dryRun.value.send().signSubmitAndWatch(signer), log),
        );

        return success(`Stored value ${value} with personhood proof`, {
          value: String(value),
          alias: toHex(proof.contextualAlias.alias),
          contract: SIMPLE_STORE_ADDRESS,
        });
      } catch (e) {
        return error(e instanceof Error ? e.message : String(e), e);
      }
    },
  },
];
