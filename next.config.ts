import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos de demonstração. Em produção, adicione aqui o domínio do storage
    // (ex.: Supabase Storage, Cloudinary, S3) e do CDN do Instagram.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
