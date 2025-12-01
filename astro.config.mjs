// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import svgr from 'vite-plugin-svgr';
import {
  SITEMAP_CUSTOM_PAGES,
  SITEMAP_EXCLUDE_PATTERNS,
  SITEMAP_PRIORITY,
} from './src/core/constants/seo.constants';

// https://astro.build/config
export default defineConfig({
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
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor libraries into separate chunks
            if (id.includes('node_modules')) {
              // React and related libraries
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }
              // Firebase (already large)
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              // TanStack Query
              if (id.includes('@tanstack/react-query')) {
                return 'vendor-query';
              }
              // Lucide icons
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Axios and API libraries
              if (id.includes('axios') || id.includes('qs')) {
                return 'vendor-api';
              }
              // Zustand state management
              if (id.includes('zustand')) {
                return 'vendor-state';
              }
              // UI libraries (tailwind, clsx, etc)
              if (id.includes('tailwind') || id.includes('clsx') || id.includes('class-variance')) {
                return 'vendor-ui';
              }
              // Other node_modules as vendor-misc
              return 'vendor-misc';
            }

            // Split large asset images/constants into separate chunks
            if (id.includes('/assets/images/') || id.includes('/assets/icons/')) {
              return 'assets-images';
            }

            // Split constants files
            if (id.includes('/constants/')) {
              return 'app-constants';
            }

            // Split screens/pages by feature
            if (id.includes('/screens/auth/')) {
              return 'feature-auth';
            }
            if (id.includes('/screens/survey')) {
              return 'feature-surveys';
            }
            if (id.includes('/screens/admin/')) {
              return 'feature-admin';
            }
          },
        },
      },
    },
  },

  adapter: node({
    mode: 'standalone',
  }),

  output: 'server',
});
