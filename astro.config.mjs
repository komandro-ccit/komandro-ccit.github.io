import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://komandro-ccit.github.io',
  base: '/',
  integrations: [
    tailwind(),
    mdx(),
    sitemap()
  ],
  server: {
    port: 4350
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
