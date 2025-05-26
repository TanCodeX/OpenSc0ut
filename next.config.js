/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
