/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable API routes to proxy to backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
