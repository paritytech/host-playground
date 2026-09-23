import { deploy, getNetwork } from "./lib.ts";
import { readBytecode, recordAddress } from "./deployment.ts";

/** Unconditional redeploy. Use `ensure.ts` unless you specifically want a fresh instance. */
async function main() {
  const { key, config } = getNetwork();
  console.log(`Network:  ${config.name} (${key})`);

  const address = await deploy(config, readBytecode());
  recordAddress(config.chainId, address);
  console.log(`\nSimpleStore deployed at: ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
