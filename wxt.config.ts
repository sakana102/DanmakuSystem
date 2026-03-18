import { defineConfig, type WxtViteConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "DanmakuSystem",
    description: "DESCRIPTION",
    permissions: ["storage", "fontSettings"],
  },
  modules: ["@wxt-dev/module-react"],
  vite: () =>
    ({
      plugins: [tailwindcss()],
    }) as WxtViteConfig,
});
