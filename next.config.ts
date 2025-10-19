import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
  images: {
    unoptimized: true
  },
  experimental: {
    serverActions: true
  },
  async rewrites() {
    return [
      {
        source: '/api/external/:path*',
        destination: 'https://puspa.sinus.ac.id/api/:path*',
      },
    ];
  },
};

export default nextConfig;
