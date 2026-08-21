import { navigateTo } from "@parity/product-sdk/host";
import type { TestDefinition, TestResult } from "@/lib/types";
import { error, success } from "./shared";

async function navigateViaHost(url: string): Promise<TestResult> {
  try {
    await navigateTo(url);
    return success(`Navigated to ${url}`);
  } catch (err) {
    const e = err as { name?: string };
    return error(e.name ?? String(err), err);
  }
}

export const navigationTests: TestDefinition[] = [
  {
    id: "navigate-internal",
    name: "Navigate In-App",
    description:
      "Navigates within the app to /navigation/ with query params and fragment",
    api: "router.push(path) (Next.js client navigation)",
    category: "navigation",
    async run({ navigate }) {
      const path = "/navigation/?id=hello#fragment=something";
      navigate(path);
      return success(`Navigating to ${path}`);
    },
  },
  {
    id: "navigate-polkadot",
    name: "Navigate to Polkadot URL",
    description: "Navigates to a host-compatible URL via hostApi",
    api: "navigateTo(url)",
    args: [{ name: "url", label: "URL", defaultValue: "https://search.dot" }],
    category: "navigation",
    async run({ args }) {
      return navigateViaHost(args.url);
    },
  },
  {
    id: "navigate-http",
    name: "Navigate to HTTP URL",
    description: "Navigates to an external HTTP/S URL via hostApi",
    api: "navigateTo(url)",
    args: [{ name: "url", label: "URL", defaultValue: "https://polkadot.com" }],
    category: "navigation",
    async run({ args }) {
      return navigateViaHost(args.url);
    },
  },
];
