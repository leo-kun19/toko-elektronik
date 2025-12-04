/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Serve frontend static files - NO rewrites for static files
  async rewrites() {
    return [];
  },
};

export default nextConfig;
