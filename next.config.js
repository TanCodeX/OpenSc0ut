/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
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
