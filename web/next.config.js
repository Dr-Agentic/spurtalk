/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:7101/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
