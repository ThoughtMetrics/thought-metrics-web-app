// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import svgr from 'vite-plugin-svgr';
import {
  SITEMAP_CUSTOM_PAGES,
  SITEMAP_EXCLUDE_PATTERNS,
  SITEMAP_PRIORITY,
} from './src/core/constants/seo.constants';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const apiProxyTarget = env.API_PROXY_TARGET || 'http://localhost:3000';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  site: import.meta.env.PUBLIC_SITE_URL ?? 'https://www.thoughtmetrics.com',
  integrations: [
    react(),
    partytown(),
    sitemap({
      // Filter out pages that should not be indexed
      filter: (page) => {
        return !SITEMAP_EXCLUDE_PATTERNS.some((pattern) =>
          page.includes(pattern)
        );
      },
      // Add specific resource pages that should be indexed
      customPages: SITEMAP_CUSTOM_PAGES,
      // Customize sitemap entries
      serialize(item) {
        // CRITICAL: Remove trailing slashes to match trailingSlash: 'never' config
        // This prevents "Alternate page with proper canonical tag" Google Search Console errors
        if (item.url.endsWith('/') && item.url !== 'https://www.thoughtmetrics.com/') {
          item.url = item.url.slice(0, -1);
        }

        // Set higher priority and more frequent updates for resources
        if (item.url.includes('/resources/')) {
          item.changefreq = ChangeFreqEnum.WEEKLY;
          item.priority = SITEMAP_PRIORITY.HIGH;
        }
        // Set default values for other pages
        else {
          item.changefreq = ChangeFreqEnum.MONTHLY;
          item.priority = SITEMAP_PRIORITY.NORMAL;
        }
        return item;
      },
    }),
    mdx(),
    icon({ iconDir: 'src/assets/icons' }),
  ],

  vite: {
    server: {
      // Bind to all network interfaces so the Network URL is exposed in terminal
      host: true,
      // Allow access via local network IPs (phones, tablets on same WiFi)
      allowedHosts: true,
      watch: {
        // Prevent server restart when .env is edited — restart manually if needed
        ignored: ['**/.env', '**/.env.*', '!**/.env.example'],
      },
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        'images/': new URL('./src/assets/images/', import.meta.url).pathname,
        'icons/': new URL('./src/assets/icons/', import.meta.url).pathname,
      },
    },
    plugins: [
      // @ts-ignore
      tailwindcss(),
      // @ts-ignore
      svgr({
        include: '**/*.svg?react',
        svgrOptions: {
          exportType: 'default',
          ref: true,
          svgo: true,
          titleProp: true,
          svgoConfig: {
            plugins: [
              {
                name: 'removeDimensions',
              },
              {
                name: 'removeAttrs',
                params: { attrs: '(fill|stroke)' },
              },
            ],
          },
        },
      }),
    ],
    ssr: {
      noExternal: ['swiper'],
    },
  },

  adapter: vercel(),

  output: 'server',
});
