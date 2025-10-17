// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import partytown from "@astrojs/partytown";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL ?? "https://www.thoughtmetrics.com",
  integrations: [
    react(),
    partytown(),
    sitemap(),
    mdx(),
    icon({ iconDir: "src/assets/icons" }),
  ],

  vite: {
    plugins: [
      tailwindcss(),
      svgr({
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
      }),
    ],
    ssr: {
      noExternal: ["swiper"],
    },
  },

  adapter: node({
    mode: "standalone",
  }),

  output: "server",
});
