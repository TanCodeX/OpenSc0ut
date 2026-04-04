/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // Prisma must load the generated client from node_modules at runtime; bundling it
  // (especially with Turbopack in dev) resolves the stub and throws "did not initialize yet".
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Next 16: dev uses Turbopack by default; a custom `webpack` hook requires an explicit
  // turbopack section so the bundler choice is intentional (see Next.js docs).
  turbopack: {},
  images: {
    domains: ["avatars.githubusercontent.com"],
    unoptimized: true,
  },
  reactStrictMode: true,
  // Ensure Next traces/builds relative to this project (avoid wrong root when other lockfiles exist)
  outputFileTracingRoot: path.join(__dirname),
  // Configure path mapping for cleaner imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;
