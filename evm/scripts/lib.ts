import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

export type NetworkKey = "paseo-next-v2" | "previewnet";

export interface NetworkConfig {
  name: string;
  ethRpc: string;
  genesis: `0x${string}`;
}

export const NETWORKS: Record<NetworkKey, NetworkConfig> = {
  "paseo-next-v2": {
    name: "Paseo Next v2 Hub",
    ethRpc: "https://eth-rpc-paseo-next.polkadot.io",
    genesis:
      "0xbf0488dbe9daa1de1c08c5f743e26fdc2a4ecd74cf87dd1b4b1eeb99ae4ef19f",
  },
  previewnet: {
    name: "Previewnet Hub",
    ethRpc: "https://previewnet.substrate.dev/eth-rpc",
    genesis:
      "0x29f7b15e6227f86b90bf5199b5c872c28649a30e5f15fae6dd8fa9d5d48d6fbb",
  },
};

// CI testnet deployer. Override with PRIVATE_KEY for a different account.
const DEFAULT_PRIVATE_KEY =
  "0x271ad9a5e1e0178acebdb572f8755aac3463d863ddfc70e32e7d5eb0b334e687";

export function getNetwork(): { key: NetworkKey; config: NetworkConfig } {
  const key = (process.env.NETWORK ?? process.argv[2]) as NetworkKey;
  if (!key || !(key in NETWORKS)) {
    console.error(
      `Set NETWORK to one of: ${Object.keys(NETWORKS).join(", ")}.`,
    );
    process.exit(1);
  }
  return { key, config: NETWORKS[key] };
}

export function getAccount() {
  const pk = (process.env.PRIVATE_KEY ?? DEFAULT_PRIVATE_KEY) as Hex;
  return privateKeyToAccount(pk.startsWith("0x") ? pk : (`0x${pk}` as Hex));
}

export async function deploy(
  config: NetworkConfig,
  abi: unknown,
  bytecode: `0x${string}`,
): Promise<`0x${string}`> {
  const account = getAccount();
  const transport = http(config.ethRpc);
  const publicClient = createPublicClient({ transport });

  const chainId = await publicClient.getChainId();
  const chain = defineChain({
    id: chainId,
    name: config.name,
    nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
    rpcUrls: { default: { http: [config.ethRpc] } },
  });
  const walletClient = createWalletClient({ account, chain, transport });

  console.log(`Deployer: ${account.address}`);
  console.log(`Network:  ${config.name} (chainId ${chainId})`);

  const hash = await walletClient.deployContract({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: abi as any,
    bytecode,
  });
  console.log(`Tx:       ${hash}`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("Deployment succeeded but no contract address in receipt");
  }
  return receipt.contractAddress;
}
