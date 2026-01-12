# 墨迹 - 个人博客

一个现代化的个人博客应用，采用 Cloudflare Workers + React 全栈技术构建，完全免费且无冷启动。

## 功能特性

- **文章管理** - 创建、编辑、删除文章，支持 Markdown 格式
- **数据库** - 使用 Cloudflare D1 (SQLite) 存储数据
- **架构** - 前后端分离，部署在 Cloudflare 边缘网络
- **精美设计** - 现代化 UI，支持动画效果和深色模式
- **响应式布局** - 完美适配移动端和桌面端

## 项目结构

```
myblog/
├── myblog_app/          # 前端应用 (React + Vite)
│   ├── src/
│   │   ├── api/         # API 请求工具
│   │   ├── components/  # 可复用组件
│   │   ├── pages/       # 页面组件
│   │   └── App.jsx      # 应用入口
│   └── package.json
│
├── myblog_worker/       # 后端服务 (Cloudflare Workers + Hono)
│   ├── src/
│   │   └── index.js     # API 路由
│   ├── schema.sql       # 数据库表结构
│   ├── wrangler.toml    # Cloudflare 配置
│   └── package.json
│
└── myblog_server/       # 遗留后端 (不再使用)
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Wrangler CLI (`npm install -g wrangler`)

### 安装依赖

```bash
# 安装后端依赖
cd myblog_worker
npm install

# 安装前端依赖
cd ../myblog_app
npm install
```

### 启动项目

```bash
# 终端 1 - 启动后端 (Cloudflare Workers, 端口 8787)
cd myblog_worker
npm run dev

# 终端 2 - 启动前端 (Vite, 端口 5173/5174)
cd myblog_app
npm run dev
```

### 调试

- **前端地址**: http://localhost:5173
- **后端 API**: http://127.0.0.1:8787/api/health

## 部署

### 后端部署 (Cloudflare Workers)

```bash
cd myblog_worker
npx wrangler login
npm run deploy
```

部署成功后会获得 API 地址（例如 `https://myblog-api.xxx.workers.dev`），**请确保将前端域名添加到 `src/index.js` 的 CORS 白名单中**。

### 前端部署 (Cloudflare Pages)

1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 创建 Pages 项目
3. 连接 GitHub 仓库
4. 构建设置：
   - Root directory: `myblog_app`
   - Build command: `npm run build`
   - Output directory: `dist`

## 技术栈

**前端**
- React 19
- Vite 7
- TailwindCSS 4
- Framer Motion

**后端**
- Cloudflare Workers
- Hono (Web 框架)
- Cloudflare D1 (SQLite 数据库)

## License

MIT
