import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // The Next project root is `apps/app`, so the static export lands in
  // `apps/app/out`. Everything that consumes the build — the worker bundle,
  // the bulletin manifest, CI — points there.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: ["@polkadot-api/descriptors"],
  webpack(config) {
    // @use-truapi/core pulls in @parity/product-sdk-host 0.24, whose native
    // chat fallback dynamically imports @novasamatech/host-api-wrapper 0.9.2.
    // That wrapper imports a pjs-signer export polkadot-api 2 no longer ships,
    // which fails the build. The playground never takes that path, so the
    // import resolves to an empty module instead.
    config.resolve.alias["@novasamatech/host-api-wrapper"] = false;
    return config;
  },
};

export default nextConfig;
