# 墨迹 - 个人博客

一个现代化的个人博客应用，采用 Cloudflare Workers + React 全栈技术构建，完全免费且无冷启动。

## 功能特性

### 核心功能
- **文章管理** - 创建、编辑、删除文章，支持 Markdown 格式
- **管理后台** - 密码保护的后台管理界面
- **数据库** - 使用 Cloudflare D1 (SQLite) 存储数据
- **分类筛选** - 支持按分类过滤文章列表
- **智能缓存** - 采用 stale-while-revalidate 策略，二次访问秒开

### 视觉效果
- **响应式布局** - 适配移动端和桌面端
- **自定义光标** - 桌面端独特的鼠标跟随效果
- **骨架屏加载** - 内容加载时的占位动画
- **滚动动画** - 元素进入视口时的渐显效果
- **磁性按钮** - 悬停时的磁性吸附交互

### 交互体验
- **音乐播放器** - 内置播放器，支持播放/暂停、上下曲、音量控制、进度拖拽
- **平滑过渡** - 页面间使用 Framer Motion 动画

## 使用指南

### 访问管理后台
管理入口已从前台隐藏：
- **本地开发**: `http://localhost:5173/admin`
- **线上环境**: `https://your-domain.pages.dev/admin`

### 数据存储说明
Cloudflare D1 数据库在开发环境和生产环境是**完全隔离**的：
- `npm run dev` 使用本地 SQLite 文件，数据仅保存在本机
- 部署后使用 Cloudflare 边缘数据库，数据保存在云端

*注意：本地创建的文章不会自动同步到线上，反之亦然。*

## 项目结构

```
myblog/
├── myblog_app/              # 前端 (React + Vite)
│   ├── src/
│   │   ├── api/             # API 请求
│   │   ├── components/
│   │   │   ├── blog/        # 博客组件
│   │   │   ├── home/        # 首页组件 (Hero, FeaturedPosts)
│   │   │   ├── layout/      # 布局 (Navbar, Footer)
│   │   │   └── ui/          # UI 组件
│   │   │       ├── CustomCursor.jsx
│   │   │       ├── MagneticButton.jsx
│   │   │       ├── MusicPlayer.jsx
│   │   │       ├── ScrollReveal.jsx
│   │   │       └── Skeleton.jsx
│   │   ├── data/            # 静态数据 (playlist)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Article.jsx
│   │   │   ├── About.jsx
│   │   │   └── Admin.jsx
│   │   └── App.jsx
│   └── package.json
│
└── myblog_worker/           # 后端 (Cloudflare Workers + Hono)
    ├── src/
    │   └── index.js         # API 路由
    ├── schema.sql           # 数据库结构
    ├── wrangler.toml        # Cloudflare 配置
    └── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Wrangler CLI (`npm install -g wrangler`)

### 安装依赖

```bash
# 后端
cd myblog_worker
npm install

# 前端
cd ../myblog_app
npm install
```

### 启动项目

```bash
# 终端 1 - 启动后端 (端口 8787)
cd myblog_worker
npm run dev

# 终端 2 - 启动前端 (端口 5173)
cd myblog_app
npm run dev
```

### 调试地址

- **前端**: http://localhost:5173
- **后端 API**: http://127.0.0.1:8787/api/health

## 部署

### 后端部署 (Cloudflare Workers)

```bash
cd myblog_worker
npx wrangler login
npm run deploy
```

部署后需将前端域名添加到 `src/index.js` 的 CORS 白名单。

### 前端部署 (Cloudflare Pages)

1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 创建 Pages 项目
3. 连接 GitHub 仓库，配置：
   - Root directory: `myblog_app`
   - Build command: `npm run build`
   - Output directory: `dist`

## 技术栈

**前端**
- React 19
- Vite 7
- TailwindCSS 4
- Framer Motion
- React Router DOM 7
- React Markdown

**后端**
- Cloudflare Workers
- Hono
- Cloudflare D1

## License

MIT
