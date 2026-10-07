import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // PRD 주요 흐름: 진입 → 요금제 목록
  async redirects() {
    return [{ source: "/", destination: "/plans", permanent: false }];
  },
};

export default nextConfig;
