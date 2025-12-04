/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Serve frontend static files
  async rewrites() {
    return [
      // SPA fallback - only for non-file routes
      {
        source: "/",
        destination: "/index.html",
      },
      {
        source: "/login",
        destination: "/index.html",
      },
      {
        source: "/dashboard",
        destination: "/index.html",
      },
      {
        source: "/stok",
        destination: "/index.html",
      },
      {
        source: "/supplier",
        destination: "/index.html",
      },
      {
        source: "/kategori",
        destination: "/index.html",
      },
      {
        source: "/admin",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
