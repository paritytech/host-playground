import {
  createHostPreimageManager,
  requestResourceAllocation,
} from "@parity/product-sdk/host";
import {
  calculateCid,
  cidToPreimageKey,
  queryBytes,
} from "@parity/product-sdk/cloud-storage";
import { toHex } from "polkadot-api/utils";
import type { TestDefinition } from "@/lib/types";
import { bytesEqual, error, pm, sdkErrorMessage, success } from "./shared";

const SAMPLE_PREIMAGE_HASH =
  "0x5e933dd685deedfbf58063678bfa2abead4dc25e6da4ffea190503cfaa940d51";

export const preimageTests: TestDefinition[] = [
  {
    id: "preimage-submit",
    name: "Submit Preimage",
    description: "Submits a preimage and gets its hash back",
    api: "getPreimageManager().submit(data)",
    category: "preimage",
    async run() {
      const data = new TextEncoder().encode(`preimage_${Date.now()}`);
      const hash = await (await pm()).submit(data);

      return success(`Preimage submitted, hash: ${hash.slice(0, 20)}...`, {
        hash,
        dataLength: data.length,
      });
    },
  },
  {
    id: "preimage-lookup",
    name: "Lookup Preimage",
    description: "Looks up a preimage by hash (5s)",
    api: "getPreimageManager().lookup(hash, callback)",
    args: [
      {
        name: "hash",
        label: "Hash (0x…)",
        defaultValue: SAMPLE_PREIMAGE_HASH,
      },
    ],
    category: "preimage",
    async run({ log, args }) {
      const hash = args.hash as `0x${string}`;
      log(`Looking up hash: ${hash.slice(0, 20)}...`);

      const preimageManager = await pm();
      return new Promise((resolve) => {
        let found = false;
        log("Starting lookup subscription...");
        const subscription = preimageManager.lookup(hash, (preimage) => {
          found = true;
          subscription.unsubscribe();
          resolve(
            preimage
              ? success(`Preimage found (${preimage.length} bytes)`, {
                  hash,
                  preimage: toHex(preimage),
                })
              : success(
                  `Lookup returned null for hash ${hash.slice(0, 20)}...`,
                ),
          );
        });

        setTimeout(() => {
          if (!found) {
            subscription.unsubscribe();
            resolve(
              success(
                `No lookup callback in 5s for hash ${hash.slice(0, 20)}...`,
              ),
            );
          }
        }, 5000);
      });
    },
  },
  {
    id: "preimage-factory",
    name: "Preimage Factory",
    description: "Creates a preimage manager via createHostPreimageManager",
    api: "createHostPreimageManager()",
    category: "preimage",
    async run() {
      const manager = await createHostPreimageManager();
      if (!manager)
        return error(
          "createHostPreimageManager returned null - not inside a host container",
        );
      const data = new TextEncoder().encode(`factory_${Date.now()}`);
      const hash = await manager.submit(data);

      return success(
        `Factory preimage submitted, hash: ${hash.slice(0, 20)}...`,
        { hash },
      );
    },
  },
  {
    id: "bulletin-upload-and-verify",
    name: "Upload File to Bulletin & Fetch by CID",
    description:
      "Submits a timestamped text file through the host's preimage submit, derives its canonical CID, and fetches it back by CID via the host's preimage lookup (no public IPFS gateway). Asserts byte equality.",
    api: "getPreimageManager().submit + calculateCid + queryBytes(cid)",
    category: "preimage",
    async run({ chain, log }) {
      log("Requesting BulletinAllowance...");
      try {
        const allocation = await requestResourceAllocation([
          { tag: "BulletinAllowance", value: undefined },
        ]);
        if (!allocation.ok) {
          return error(sdkErrorMessage(allocation.error), allocation.error);
        }
      } catch (allocErr) {
        return error("Bulletin allowance request failed", allocErr);
      }

      const filename = `host-playground-upload-${Date.now()}.txt`;
      const content =
        `host-playground bulletin upload\n` +
        `timestamp: ${new Date().toISOString()}\n` +
        `chain: ${chain.name} (${chain.network})\n` +
        `genesis: ${chain.genesis}\n`;
      const payload = new TextEncoder().encode(content);
      log(`Generated ${payload.length} bytes (${filename})`);

      // Upload via the host's preimage submit (wrapped) — the host routes it to
      // the bulletin chain; the product never opens an RPC or its own PAPI.
      log("Submitting via (await pm()).submit...");
      const hash = await (await pm()).submit(payload);
      log(`Host returned preimage key: ${hash}`);

      // calculateCid uses the bulletin runtime's codec+hashing (raw 0x55 +
      // blake2b-256), so the CID matches what was stored (tiny payload → no
      // chunking / DAG-PB manifest).
      const cid = (await calculateCid(payload)).toString();
      log(`Canonical CID: ${cid}`);

      // Fast-fail: the CID-derived preimage key must equal the host's submit
      // key, else queryBytes burns the full lookup timeout before failing.
      const derivedKey = cidToPreimageKey(cid);
      if (derivedKey.toLowerCase() !== hash.toLowerCase()) {
        return error("CID-derived preimage key ≠ host submit key", {
          cid,
          derivedKey,
          hash,
        });
      }

      // Fetch back BY CID through the host's preimage lookup.
      log(
        "Fetching by CID via queryBytes (host preimage lookup, up to 60s)...",
      );
      let fetched: Uint8Array;
      try {
        const fetchResult = await queryBytes(cid, { lookupTimeoutMs: 60_000 });
        if (!fetchResult.ok) {
          return error("Fetch by CID via host failed", {
            cid,
            hash,
            submitted: toHex(payload),
            reason: sdkErrorMessage(fetchResult.error),
          });
        }
        fetched = fetchResult.value;
      } catch (e) {
        return error("Fetch by CID via host failed", {
          cid,
          hash,
          submitted: toHex(payload),
          reason: e instanceof Error ? e.message : String(e),
        });
      }

      const equal = bytesEqual(payload, fetched);
      log(`Fetched ${fetched.length} bytes by CID, equal=${equal}`);
      if (!equal) {
        return error("Fetched bytes ≠ submitted payload", {
          cid,
          hash,
          submitted: toHex(payload),
          fetched: toHex(fetched),
        });
      }

      return success(
        `Round-trip verified via host: submit + fetch-by-CID, ${payload.length} bytes`,
        {
          filename,
          content,
          hash,
          cid,
          submittedBytes: payload.length,
          fetchedBytes: fetched.length,
          payloadEqualsFetched: true,
        },
      );
    },
  },
];
