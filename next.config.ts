import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: process.cwd(),
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  experimental: {
    missingSuspenseWithCSRError: false,
  },
  // Disable static generation for problematic pages
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default withNextIntl(nextConfig);
