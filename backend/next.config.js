/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Serve frontend static files
  async rewrites() {
    return {
      beforeFiles: [
        // API routes - no rewrite needed
      ],
      afterFiles: [],
      fallback: [
        // Only rewrite non-asset paths to index.html for SPA routing
        {
          source: '/:path((?!assets|api|images|_next).*)',
          destination: '/index.html',
        },
      ],
    };
  },
};

export default nextConfig;
