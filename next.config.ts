import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  agentRules: false,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
