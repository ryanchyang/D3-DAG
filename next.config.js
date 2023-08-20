/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    APP_ENV: process.env.APP_ENV,
  },
  images: {
    domains: ['image.whospay.com'],
  },
};

module.exports = nextConfig;
