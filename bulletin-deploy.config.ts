/**
 * Product manifest config for `bulletin-deploy` (RFC 0001).
 *
 * Picked up by the bulletin-deploy CLI by walking up from the build dir on
 * each deploy. When present, the CLI writes the root + per-executable
 * dotNS text records on top of the legacy contenthash publish; when
 * missing, the legacy contenthash deploy is the only thing that runs.
 *
 * `domain` MUST match the CLI's deploy domain — for PR-preview deploys we
 * read it from MANIFEST_DOMAIN, falling back to the canonical name for
 * local invocations and pushes to main.
 *
 * Intentionally no `import { defineConfig } from "bulletin-deploy"` —
 * keeps bulletin-deploy out of our local node_modules (the CLI runs from
 * the global install in CI, jiti would otherwise fail to resolve the
 * bare specifier from the workspace). The CLI's runtime validator checks
 * the shape on load, so we don't lose any safety.
 */

export default {
  domain: process.env.MANIFEST_DOMAIN ?? "host-playground",
  displayName: "Host Playground",
  description:
    "Reference playground exercising the @parity/product-sdk Host API surface against a paired Polkadot host.",
  // Placeholder 1×1 PNG — replace with a real product icon (jpeg or png).
  // Path resolves relative to this config file.
  icon: { path: "./apps/app/public/icon.png", format: "png" as const },
  executables: [
    {
      kind: "app" as const,
      path: "./apps/app/out",
      appVersion: [0, 1, 0] as const,
    },
    {
      kind: "worker" as const,
      path: "./apps/app/out/worker",
      appVersion: [0, 1, 0] as const,
      entrypoint: "index.js",
      includes: { chat: true, pocket: false },
    },
  ],
};
