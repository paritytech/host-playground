import type { TestDefinition } from "@/lib/types";
import { accountIndex, runResourceAllocation } from "./shared";

export const allowancesTests: TestDefinition[] = [
  {
    id: "allowances-statement-store",
    name: "Allocate StatementStore Allowance",
    description:
      "Requests a statement-store allowance from the host (RFC-0010)",
    api: 'requestResourceAllocation([{ tag: "StatementStoreAllowance" }])',
    category: "allowances",
    async run() {
      return runResourceAllocation([
        { tag: "StatementStoreAllowance", value: undefined },
      ]);
    },
  },
  {
    id: "allowances-bulletin",
    name: "Allocate Bulletin Allowance",
    description: "Requests a bulletin allowance from the host (RFC-0010)",
    api: 'requestResourceAllocation([{ tag: "BulletinAllowance" }])',
    category: "allowances",
    async run() {
      return runResourceAllocation([
        { tag: "BulletinAllowance", value: undefined },
      ]);
    },
  },
  {
    id: "allowances-smart-contract",
    name: "Allocate SmartContract Allowance",
    description:
      "Requests a smart-contract allowance for a derivation index (RFC-0010)",
    api: 'requestResourceAllocation([{ tag: "SmartContractAllowance", value: { tag: "Left", value: derivationIndex } }])',
    args: [
      {
        name: "derivationIndex",
        label: "Derivation index",
        defaultValue: "0",
      },
    ],
    category: "allowances",
    async run({ args }) {
      return runResourceAllocation([
        {
          tag: "SmartContractAllowance",
          value: accountIndex(Number(args.derivationIndex)),
        },
      ]);
    },
  },
  {
    id: "allowances-all",
    name: "Allocate All Resources",
    description:
      "Requests every supported resource in a single call; outcomes are reported per resource",
    api: "requestResourceAllocation([...])",
    args: [
      {
        name: "derivationIndex",
        label: "SmartContract derivation index",
        defaultValue: "0",
      },
    ],
    category: "allowances",
    async run({ args }) {
      return runResourceAllocation([
        { tag: "StatementStoreAllowance", value: undefined },
        { tag: "BulletinAllowance", value: undefined },
        {
          tag: "SmartContractAllowance",
          value: accountIndex(Number(args.derivationIndex)),
        },
      ]);
    },
  },
];
