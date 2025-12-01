/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Konfigurasi CORS untuk mengizinkan frontend mengakses backend
  async headers() {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
      process.env.RAILWAY_PUBLIC_DOMAIN,
    ].filter(Boolean);

    return [
      {
        // Terapkan headers ini ke semua API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { 
            key: "Access-Control-Allow-Origin", 
            value: process.env.FRONTEND_URL || "http://localhost:5173" 
          },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
      {
        // CORS untuk images
        source: "/images/:path*",
        headers: [
          { 
            key: "Access-Control-Allow-Origin", 
            value: process.env.FRONTEND_URL || "http://localhost:5173" 
          },
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
