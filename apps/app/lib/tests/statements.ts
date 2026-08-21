import { createProofAuthorized } from "@parity/product-sdk/host";
import type { TestDefinition } from "@/lib/types";
import {
  createExpiryFromDuration,
  error,
  hashTopic,
  sdkErrorMessage,
  STATEMENT_TTL_SECS,
  statements,
  success,
  toHexString,
} from "./shared";

/** A fresh unsigned statement carrying a timestamped payload. */
function draftStatement() {
  return {
    proof: undefined,
    decryptionKey: undefined,
    expiry: createExpiryFromDuration(STATEMENT_TTL_SECS),
    channel: undefined,
    topics: [],
    data: toHexString(new TextEncoder().encode(`Statement: ${Date.now()}`)),
  };
}

/** Host statement rejections carry the reason in a payload, not the message. */
function statementError(e: unknown) {
  const err = e as { name?: string; payload?: { reason?: string } };
  return error(
    err.name
      ? `${err.name}${err.payload?.reason ? ` - ${err.payload.reason}` : ""}`
      : String(e),
  );
}

/** A proof is either signed off-chain or anchored on it. */
function proofSignature(proof: { value: unknown }) {
  const value = proof.value;
  return value && typeof value === "object" && "signature" in value
    ? String(value.signature).slice(0, 20)
    : "onchain";
}

export const statementTests: TestDefinition[] = [
  {
    id: "statement-store-create-proof",
    name: "Create Proof",
    description: "Creates an authorized statement proof via getStatementStore",
    api: "statementStore.createProofAuthorized(statement)",
    category: "statements",
    async run() {
      const statementStore = await statements();

      try {
        const proof =
          await statementStore.createProofAuthorized(draftStatement());
        return success(
          `Proof type: ${proof.tag}, sig: ${proofSignature(proof)}...`,
        );
      } catch (e) {
        return statementError(e);
      }
    },
  },
  {
    id: "statement-store-create-proof-authorized",
    name: "Create Proof Authorized",
    description: "Creates a statement store proof via authorized account",
    api: "createProofAuthorized(statement)",
    category: "statements",
    async run() {
      try {
        const result = await createProofAuthorized(draftStatement());
        if (!result.ok)
          return error(sdkErrorMessage(result.error), result.error);
        const proof = result.value;
        return success(
          `Proof type: ${proof.tag}, sig: ${proofSignature(proof)}...`,
        );
      } catch (err) {
        const e = err as { payload?: unknown };
        return error(String(err), e.payload);
      }
    },
  },
  {
    id: "statement-store-submit",
    name: "Submit Statement",
    description: "Creates a proof then submits the signed statement",
    api: "statementStore.submit(signedStatement)",
    category: "statements",
    async run({ log }) {
      const statementStore = await statements();
      const statement = draftStatement();

      try {
        log("Creating proof...");
        const proof = await statementStore.createProofAuthorized(statement);
        log(`Proof created: ${proof.tag}`);

        log("Submitting signed statement...");
        await statementStore.submit({ ...statement, proof });
        return success("Statement submitted successfully");
      } catch (e) {
        return statementError(e);
      }
    },
  },
  {
    id: "statement-store-subscribe-match-all",
    name: "Subscribe Statements",
    description: "Subscribes to statement store topics (5s)",
    api: "statementStore.subscribe(filter, callback)",
    category: "statements",
    async run() {
      const statementStore = await statements();

      return new Promise((resolve) => {
        const received: unknown[] = [];
        const subscription = statementStore.subscribe(
          { matchAll: [] },
          (page) => {
            received.push(...page.statements);
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(
              `Received ${received.length} statements in 5s`,
              received.slice(-5),
            ),
          );
        }, 5000);
      });
    },
  },
  {
    id: "statement-store-subscribe-match-any",
    name: "Subscribe Statements (matchAny)",
    description:
      "Subscribes to statement store using a matchAny topic filter (5s)",
    api: "statementStore.subscribe({ matchAny: [topic1, topic2] }, callback)",
    args: [
      {
        name: "topicA",
        label: "Topic A",
        defaultValue: "host-playground:topic-a",
      },
      {
        name: "topicB",
        label: "Topic B",
        defaultValue: "host-playground:topic-b",
      },
    ],
    category: "statements",
    async run({ args }) {
      const statementStore = await statements();
      const topicA = await hashTopic(args.topicA);
      const topicB = await hashTopic(args.topicB);

      return new Promise((resolve) => {
        const received: unknown[] = [];
        const subscription = statementStore.subscribe(
          { matchAny: [topicA, topicB] },
          (page) => {
            received.push(...page.statements);
          },
        );

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(
            success(
              `Received ${received.length} statements in 5s (matchAny)`,
              received.slice(-5),
            ),
          );
        }, 5000);
      });
    },
  },
];
