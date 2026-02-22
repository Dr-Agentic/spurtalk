/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable API routes to proxy to backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:7101/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
