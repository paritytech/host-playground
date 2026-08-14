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
};

export default nextConfig;
