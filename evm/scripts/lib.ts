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
      "0x23e730eb1c6fecae09c917439a5038cb6122d0d48980e8b9bbf0ff56f94a2ca6",
  },
  previewnet: {
    name: "Previewnet Hub",
    ethRpc: "https://previewnet.substrate.dev/eth-rpc",
    genesis:
      "0x4d11c803cc6921429e3876638977ad006ea1bba8cd3976a0bca2f164e7026210",
  },
};

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
  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    console.error(
      "Set PRIVATE_KEY to a testnet deployer account funded on the target network.",
    );
    process.exit(1);
  }
  return privateKeyToAccount(
    pk.startsWith("0x") ? (pk as Hex) : (`0x${pk}` as Hex),
  );
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
