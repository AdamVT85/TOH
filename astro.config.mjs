// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://traveloldhollywood.com',
  adapter: vercel(),
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
