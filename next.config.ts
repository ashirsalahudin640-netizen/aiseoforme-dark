import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the user folder would otherwise be treated as the root.
  turbopack: { root: __dirname },
};

export default nextConfig;
