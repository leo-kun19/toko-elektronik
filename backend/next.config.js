/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CORS Configuration - Allow all origins for now
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With, Accept" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },
  
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
