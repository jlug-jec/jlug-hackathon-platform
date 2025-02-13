import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jlug.club',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
