const withNextIntl = require('next-intl/plugin')('./i18n.ts');
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = withNextIntl(nextConfig);
