#!/usr/bin/env node
/**
 * Local test-host launcher.
 *
 * Spins up @parity/host-api-test-sdk's createTestHostServer pointing at the
 * Next.js dev server (http://localhost:3000). Open the printed URL in a
 * browser — host-playground loads inside an iframe with a real Spektr host
 * (Alice account, auto-signing, RFC-0006 payments mocked, paseo-asset-hub
 * RPC proxied).
 *
 * Usage:
 *   yarn dev                       # in one terminal
 *   node scripts/test-host.mjs     # in another
 */
import { createTestHostServer, PASEO_ASSET_HUB } from "@parity/host-api-test-sdk";

const PRODUCT_URL = process.env.PRODUCT_URL ?? "http://localhost:3000";

const server = await createTestHostServer({
    productUrl: PRODUCT_URL,
    accounts: ["alice", "bob"],
    chain: PASEO_ASSET_HUB,
    productAccounts: {
        "host-playground.dot/0": "alice",
        "localhost:3000/0": "alice",
    },
});

console.log("\nTest host running.\n");
console.log("  Product:    " + PRODUCT_URL);
console.log("  Host URL:   " + server.url);
console.log("  Accounts:   alice, bob");
console.log("  Chain:      " + PASEO_ASSET_HUB.name);
console.log("\nOpen the Host URL above in your browser.\n");

const shutdown = async () => {
    console.log("\nShutting down test host...");
    await server.close();
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
