import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import type { ChainId } from "./lib.ts";

const EVM_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEPLOYMENT_FILE = path.join(EVM_DIR, "deployment.json");
const ARTIFACT = path.join(EVM_DIR, "out/SimpleStore.sol/SimpleStore.json");

export interface ChainDeployment {
  simpleStore: `0x${string}`;
}

type DeploymentFile = Partial<Record<ChainId, ChainDeployment>>;

function read(): DeploymentFile {
  if (!fs.existsSync(DEPLOYMENT_FILE)) return {};
  return JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf-8")) as DeploymentFile;
}

export function recordedAddress(chainId: ChainId): `0x${string}` | undefined {
  return read()[chainId]?.simpleStore;
}

/** Rewrites only this chain's entry, so deploying one network leaves the other intact. */
export function recordAddress(chainId: ChainId, simpleStore: `0x${string}`): void {
  const deployment = read();
  deployment[chainId] = { simpleStore };
  const ordered = Object.fromEntries(
    Object.keys(deployment).sort().map((key) => [key, deployment[key as ChainId]]),
  );
  fs.writeFileSync(DEPLOYMENT_FILE, JSON.stringify(ordered, null, 2) + "\n");
  console.log(`Wrote ${path.relative(EVM_DIR, DEPLOYMENT_FILE)} [${chainId}]`);
}

/** SimpleStore's creation bytecode, from `forge build`. */
export function readBytecode(): `0x${string}` {
  if (!fs.existsSync(ARTIFACT)) {
    console.error(
      `Missing ${path.relative(EVM_DIR, ARTIFACT)}. Run \`forge build\` in evm/ first.`,
    );
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(ARTIFACT, "utf-8"));
  return artifact.bytecode.object as `0x${string}`;
}
