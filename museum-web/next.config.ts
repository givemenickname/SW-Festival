import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/openvgal/content/index.html',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
