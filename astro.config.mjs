// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { remarkCallouts } from './src/plugins/remark-callouts';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  markdown: {
    processor: unified({ remarkPlugins: [remarkCallouts] }),
  },
  vite: {
    plugins: [tailwindcss()]
  }
});