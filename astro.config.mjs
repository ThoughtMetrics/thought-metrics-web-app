// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import react from "@astrojs/react";
import svgr from "vite-plugin-svgr";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    icon({ iconDir: "public/icons" }),
    sitemap(),
    react(),
  ],
  site: import.meta.env.SITE_URL ?? "https://www.thoughtmetrics.com",
  vite: {
    ssr: {
      noExternal: ['swiper']
    },
    plugins: [svgr({
      include: "**/*.svg?react",
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: true,
        titleProp: true,
        svgoConfig: {
          plugins: [
            {
              name: "removeDimensions",
            },
            {
              name: "removeAttrs",
              params: { attrs: "(fill|stroke)" },
            },
          ],
        },
      },
    }), tailwindcss()],
  },
});