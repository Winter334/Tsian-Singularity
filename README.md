# Tsian Singularity

Tsian Singularity 是一个面向 Tsian 平台的独立远程游戏前端。它运行在 Tsian `/play` 页面加载的 iframe 中，并通过 `tsian.play-bridge.v1` 与平台运行时通信。

本项目的核心玩法是将小说文本转化为可扮演的互动世界：玩家导入小说后，由 Agent 读取原著内容、抽取世界设定、构建角色与剧情上下文；玩家随后可以选择扮演原著角色，或创建原创角色进入该世界游玩。

## 项目定位

本仓库只负责 Tsian Singularity 的前端表现层与交互体验，不包含 Tsian 平台本体、Agent Runtime、存档系统或创意工坊实现。

与 Tsian 主仓库的关系如下：

- Tsian 主仓库负责平台、协议、运行时与游戏卡管理。
- 本仓库负责一个具体玩法的远程游戏前端实现。
- 两者通过 `@tsian/play-bridge` 暴露的前端 SDK 通信。
- 游戏卡只需要绑定本项目部署后的远程 URL，即可加载最新前端。

## 环境要求

建议使用：

- Node.js 22
- npm

兼容要求：

- Node.js 20.19+ 也满足 Vite 6 的运行要求。
- Tsian 平台需要支持 `tsian.play-bridge.v1`。
- 本项目依赖 `@tsian/play-bridge@0.2.0-beta.0` 与 `@tsian/contracts@0.2.0-beta.0`。

> 注意：`@tsian/*` 包当前使用 beta 版本。请不要随意改成 `latest`，因为 npm 的 `latest` 标签不一定指向本项目所需的协议版本。

## 安装依赖

```bash
npm install
```

## 本地开发

启动本项目开发服务器：

```bash
npm run dev
```

默认端口为：

```text
http://localhost:5174/
```

随后需要在 Tsian 平台中，将游戏卡前端绑定设置为远程前端：

```json
{
  "kind": "remote",
  "url": "http://localhost:5174/",
  "bridgeVersion": "tsian.play-bridge.v1"
}
```

本项目需要由 Tsian 平台以 iframe 方式加载。直接在浏览器中打开 `http://localhost:5174/` 可以检查页面编译结果，但完整的游戏功能依赖 Tsian 平台提供的 bridge、存档、Agent 与 workspace 能力。

## 构建

```bash
npm run build
```

构建产物输出到：

```text
dist/
```

`dist/` 目录可部署到任意静态站点服务，例如：

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages
- 自建 Nginx / CDN 静态服务

生产环境游戏卡可以绑定部署后的地址：

```json
{
  "kind": "remote",
  "url": "https://example.com/tsian-singularity/",
  "bridgeVersion": "tsian.play-bridge.v1"
}
```

## 部署注意事项

### HTTPS

面向玩家的正式部署建议使用 HTTPS。

如果 Tsian 平台本身运行在 HTTPS 下，浏览器通常会阻止加载 HTTP iframe，因此生产环境不建议使用非 HTTPS 远程前端地址。

### iframe 嵌入

远程前端必须允许被 Tsian 平台以 iframe 加载。

部署服务不应设置以下响应头：

```http
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
```

如果配置了 CSP，也需要确保 `frame-ancestors` 不会阻止 Tsian 平台来源。

### 静态资源路径

`vite.config.ts` 中保留了：

```ts
base: "./"
```

这样构建后的资源会使用相对路径，便于部署到静态站子路径、版本目录或回滚目录。

### 缓存策略

推荐部署时采用以下缓存策略：

- `index.html`：不强缓存，便于快速发布更新。
- `assets/*`：可以长期缓存，因为 Vite 构建产物包含内容哈希。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 协议版本

当前前端绑定协议为：

```text
tsian.play-bridge.v1
```

对应依赖版本：

```json
{
  "@tsian/contracts": "0.2.0-beta.0",
  "@tsian/play-bridge": "0.2.0-beta.0"
}
```

如果后续 Tsian 平台升级 bridge 协议，需要同步确认本项目依赖版本与游戏卡 `bridgeVersion` 是否兼容。
