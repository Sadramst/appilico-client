import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "5001",
      },
      {
        protocol: "https",
        hostname: "**.blob.core.windows.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/profile",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
