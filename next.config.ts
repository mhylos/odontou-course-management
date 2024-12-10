import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
