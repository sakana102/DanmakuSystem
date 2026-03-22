import { defineConfig, type WxtViteConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "DanmakuSystem",
    description: "DESCRIPTION",
    default_locale: "ja",
    permissions: ["storage", "fontSettings"],
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  vite: () =>
    ({
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    }) as WxtViteConfig,
});
