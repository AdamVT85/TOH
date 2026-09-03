// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { IMAGE_SIZES } from './src/lib/images.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://traveloldhollywood.com',
  adapter: vercel({
    // Serve every <Image> through Vercel's Image Optimization API in production
    // (resized, WebP/AVIF, cached at the edge). Dev uses the local sharp service.
    // `sizes` must list every width the <Img> component presets request.
    imageService: true,
    imagesConfig: {
      sizes: IMAGE_SIZES,
      domains: [],
      formats: ['image/avif', 'image/webp'],
    },
  }),
  integrations: [react(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID': 'process.env.KEYSTATIC_GITHUB_CLIENT_ID',
      'import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET': 'process.env.KEYSTATIC_GITHUB_CLIENT_SECRET',
      'import.meta.env.KEYSTATIC_SECRET': 'process.env.KEYSTATIC_SECRET',
      // Keystatic's client bundle reads process.env.NODE_ENV, which doesn't
      // exist in the browser; inline it so the admin UI can hydrate in dev.
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
    },
  },
});
