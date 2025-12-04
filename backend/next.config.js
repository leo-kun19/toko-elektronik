/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serve static files dari folder image
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/../image/:path*',
      },
    ];
  },
};

export default nextConfig;
