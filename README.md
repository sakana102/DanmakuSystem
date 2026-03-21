# DanmakuSystem セットアップ方法

## 1. Dev Container で開く

```
pnpm install
```

## 2. vite.config.ts を一時的に作成

プロジェクトのルートフォルダに以下の内容の vite.config.ts を作成

```
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## 3. shadcn/ui の初期化

```
pnpm dlx shadcn@latest init
```

## 4. vite.config.ts を削除

shadcn の初期化完了後、vite.config.ts を削除する
