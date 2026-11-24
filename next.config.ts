import type { NextConfig } from "next";

// The browser only talks to this site's own origin; /api is proxied to the
// backend so sign-in cookies stay first-party (see docs/sign-in.md).
const apiUrl = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
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
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

export default nextConfig;
