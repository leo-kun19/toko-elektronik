/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CORS Configuration
  async headers() {
    const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
    
    console.log('🌍 Next.js Config - Allowed Origin:', allowedOrigin);
    
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
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
