import {
  Bell,
  Compass,
  CreditCard,
  Database,
  FileCode,
  KeyRound,
  Link2,
  Lock,
  LogIn,
  Package,
  Palette,
  PenLine,
  Plug,
  ScrollText,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { testsByCategory } from "@/lib/tests";
import type { TestCategory } from "@/lib/types";

export const CATEGORY_ICONS: Record<TestCategory, LucideIcon> = {
  extension: Plug,
  accounts: User,
  signing: PenLine,
  storage: Database,
  permissions: Lock,
  statements: ScrollText,
  preimage: Search,
  notifications: Bell,
  navigation: Compass,
  chain: Link2,
  contract: FileCode,
  theme: Palette,
  entropy: KeyRound,
  auth: LogIn,
  payments: CreditCard,
  allowances: Package,
};

export const CATEGORY_INFO: Record<
  TestCategory,
  { title: string; description: string }
> = {
  extension: {
    title: "Extension & Providers",
    description: "Test extension injection and provider creation",
  },
  accounts: {
    title: "Accounts",
    description: "Retrieve account information",
  },
  signing: {
    title: "Signing",
    description: "Sign messages and transaction payloads",
  },
  storage: {
    title: "Storage",
    description: "Read, write, and clear storage",
  },
  permissions: {
    title: "Permissions",
    description: "Request permissions and check features",
  },
  statements: {
    title: "Statement Store",
    description: "Create proofs and subscribe to statements",
  },
  preimage: {
    title: "Preimage",
    description: "Submit and lookup preimages",
  },
  notifications: {
    title: "Notifications",
    description: "Send push notifications to the host",
  },
  navigation: {
    title: "Navigation",
    description: "Test deeplinks with paths, query params, and fragments",
  },
  chain: {
    title: "Chain Interaction",
    description: "Typed chain spec and chain head protocol",
  },
  contract: {
    title: "Contract",
    description:
      "Read and write operations on the SimpleStore Solidity contract",
  },
  theme: {
    title: "Theme",
    description: "Subscribe to host theme (light/dark) changes",
  },
  entropy: {
    title: "Entropy",
    description: "Derive deterministic entropy from keys (RFC-0007)",
  },
  auth: {
    title: "Auth & Login",
    description: "Login flow and root account access (RFC-0009, RFC-0010)",
  },
  payments: {
    title: "Payments",
    description: "Balance, top-ups, and payment requests (RFC-0006)",
  },
  allowances: {
    title: "Allowances",
    description:
      "Request statement-store, bulletin, smart-contract, and auto-signing allocations (RFC-0010)",
  },
};

// Sidebar/content grouping: "Local" = host/webview-side APIs, "Network" =
// APIs that reach the chain. Also drives the order the category sections
// render in, so the active-section highlight in the sidebar tracks coherently.
const CATEGORY_GROUPS: { label: string; categories: TestCategory[] }[] = [
  {
    label: "Network",
    categories: [
      "signing",
      "statements",
      "preimage",
      "chain",
      "contract",
      "payments",
      "allowances",
    ],
  },
  {
    label: "Local",
    categories: [
      "extension",
      "accounts",
      "storage",
      "permissions",
      "notifications",
      "navigation",
      "theme",
      "entropy",
      "auth",
    ],
  },
];

// Drop any category with no tests, then flatten to the render order.
export const SIDEBAR_GROUPS = CATEGORY_GROUPS.map((group) => ({
  label: group.label,
  items: group.categories
    .filter((category) => testsByCategory[category].length)
    .map((category) => ({
      id: category,
      title: CATEGORY_INFO[category].title,
      icon: CATEGORY_ICONS[category],
      count: testsByCategory[category].length,
    })),
})).filter((group) => group.items.length > 0);

export const ORDERED_CATEGORIES = SIDEBAR_GROUPS.flatMap((group) =>
  group.items.map((item) => item.id),
);
