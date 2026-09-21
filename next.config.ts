import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@cloudflare/kumo"],
  serverExternalPackages: ["highlight.js"],
};

export default nextConfig;
