import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=true gera um site 100% estático em /out (usado no deploy da
 * demonstração no GitHub Pages). Sem a variável, o projeto roda normalmente
 * com servidor Next.js — que será o modo de produção com banco e integrações.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
    basePath: basePath || undefined,
  }),
  images: {
    // Exportação estática não tem servidor de otimização de imagens.
    unoptimized: isStaticExport,
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
