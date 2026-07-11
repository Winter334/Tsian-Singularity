import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// Tsian Singularity：独立远程游戏前端。
// 开发时由 Tsian platform-web @5173 以 iframe 加载本 dev server @5174。
// 协议层从已安装的 @tsian/play-bridge / @tsian/contracts npm 包解析。
// build.minify: false → 产出可读 ESM JS，供助手 agent 在线编辑场景。
// base: "./" → 产物用相对路径（./assets/...），便于静态站、子路径和回滚版本目录部署。
// vue 插件 → SFC 编译（dev HMR + build）。
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
  },
  base: "./",
  build: {
    minify: false,
    outDir: "dist",
  },
})
