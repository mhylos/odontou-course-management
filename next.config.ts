import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/courses/:id/*",
        destination: "/courses/:id",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/courses/:id",
        destination: "/courses/:id/info",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
