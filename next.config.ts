import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root detection
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
