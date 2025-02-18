import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api3.twilightcyber.com/:path*', // Proxy to external site
      },
    ]
  },
}

export default nextConfig;
