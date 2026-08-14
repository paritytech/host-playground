import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { deploy, getNetwork } from "./lib.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVM_DIR = path.resolve(__dirname, "..");
const OUT_DIR = path.join(EVM_DIR, "out");
const DEPLOYMENT_FILE = path.join(EVM_DIR, "deployment.json");

async function main() {
  const { config } = getNetwork();

  const artifact = JSON.parse(
    fs.readFileSync(
      path.join(OUT_DIR, "SimpleStore.sol/SimpleStore.json"),
      "utf-8",
    ),
  );

  const address = await deploy(
    config,
    artifact.abi,
    artifact.bytecode.object,
  );

  const deployment = { simpleStore: address };
  fs.writeFileSync(
    DEPLOYMENT_FILE,
    JSON.stringify(deployment, null, 2) + "\n",
  );

  console.log(`\nSimpleStore deployed at: ${address}`);
  console.log(`Wrote ${path.relative(EVM_DIR, DEPLOYMENT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
