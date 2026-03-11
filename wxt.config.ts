import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "DanmakuSystem",
    description: "DESCRIPTION",
    permissions: ["storage", "fontSettings"],
  },
  modules: ["@wxt-dev/module-react"],
});
