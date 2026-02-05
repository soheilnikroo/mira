import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone output for Docker deployments
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'doodleipsum.com',
      },
    ],
  },
};

export default nextConfig;
