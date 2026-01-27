"use client";

import { CHAINS, type ChainId } from "@/src/lib/types";

interface ChainSelectorProps {
  selectedChain: ChainId;
  onChainChange: (chain: ChainId) => void;
}

export function ChainSelector({
  selectedChain,
  onChainChange,
}: ChainSelectorProps) {
  return (
    <select
      value={selectedChain}
      onChange={(e) => onChainChange(e.target.value as ChainId)}
      className="h-10 px-4 rounded-xl border border-border bg-background text-sm font-medium cursor-pointer hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {(Object.keys(CHAINS) as ChainId[]).map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId].name} ({CHAINS[chainId].network})
        </option>
      ))}
    </select>
  );
}
