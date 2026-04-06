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
  },
});
