import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  // A stray lockfile in the home directory makes Turbopack infer the workspace
  // root as ~, which pulls the whole home directory into module resolution.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
