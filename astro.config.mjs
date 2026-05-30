import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  site: 'https://komandro-ccit.github.io',
  base: '/komandro-ccit/',
  integrations: [
    tailwind(),
    mdx()
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
