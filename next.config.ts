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
    return [
      { source: "/api/:path*", destination: `${apiUrl}/api/:path*` },
      // The live board's Socket.IO endpoint. Polling works through this
      // proxy; the WebSocket upgrade needs the reverse proxy in production.
      // The client's request has no trailing slash once Next normalises it.
      { source: "/socket.io", destination: `${apiUrl}/socket.io/` },
      { source: "/socket.io/:path*", destination: `${apiUrl}/socket.io/:path*` },
    ];
  },
};

export default nextConfig;
