/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Serve frontend static files
  async rewrites() {
    return {
      beforeFiles: [
        // API routes - no rewrite needed
      ],
      afterFiles: [
        // Serve frontend for all non-API routes
        {
          source: '/:path*',
          destination: '/index.html',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*text/html.*)',
            },
          ],
        },
      ],
      fallback: [
        // Fallback to index.html for SPA routing
        {
          source: '/:path*',
          destination: '/index.html',
        },
      ],
    };
  },
};

export default nextConfig;
