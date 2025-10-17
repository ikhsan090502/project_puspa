import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://puspa.sinus.ac.id/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
