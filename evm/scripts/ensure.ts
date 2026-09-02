import { deploy, getNetwork, hasCode, withRetry } from "./lib.ts";
import { readBytecode, recordAddress, recordedAddress } from "./deployment.ts";

/**
 * Deploys SimpleStore only when the recorded address holds no code on the
 * target network, so CI can run this on every job: a no-op in the normal case,
 * one deploy after the chain is wiped.
 */
async function main() {
  const { key, config } = getNetwork();
  console.log(`Network:  ${config.name} (${key})`);

  const recorded = recordedAddress(config.chainId);
  if (recorded) {
    const live = await withRetry("eth_getCode", 3, () =>
      hasCode(config, recorded),
    );
    if (live) {
      console.log(`SimpleStore already deployed at ${recorded} — nothing to do.`);
      return;
    }
    console.log(`Recorded ${recorded} holds no code — redeploying.`);
  } else {
    console.log(`No address recorded for ${config.chainId} — deploying.`);
  }

  const address = await deploy(config, readBytecode());
  recordAddress(config.chainId, address);
  console.log(`\nSimpleStore deployed at: ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
