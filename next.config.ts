import type { NextConfig } from 'next';

// Suppress TypeScript error for missing type declarations
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...(config.plugins || []), new PrismaPlugin()];
    }
    return config;
  },
  eslint : {
    ignoreDuringBuilds : true
  }
};

export default nextConfig;