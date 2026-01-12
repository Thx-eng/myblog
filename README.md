# 墨迹 - 个人博客

一个现代化的个人博客应用，采用 React + Express + SQLite 全栈技术构建。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## ✨ 功能特性

- 📝 **文章管理** - 创建、编辑、删除文章
- 🏷️ **分类筛选** - 按类别浏览文章
- 🎨 **精美设计** - 现代化 UI，支持动画效果
- 📱 **响应式布局** - 完美适配移动端和桌面端
- ⚡ **快速加载** - Vite 构建，极速开发体验

## 📁 项目结构

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
└── myblog_server/       # 后端服务 (Express + SQLite)
    ├── db/              # 数据库配置
    ├── routes/          # API 路由
    ├── server.js        # 服务入口
    └── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
# 安装后端依赖
cd myblog_server
npm install

# 安装前端依赖
cd ../myblog_app
npm install
```

### 启动项目

```bash
# 终端 1 - 启动后端服务 (端口 3001)
cd myblog_server
npm start

# 终端 2 - 启动前端应用 (端口 5173)
cd myblog_app
npm run dev
```

### 访问应用

| 页面 | 地址 |
|------|------|
| 🏠 首页 | http://localhost:5173 |
| 📖 博客列表 | http://localhost:5173/blog |
| 📝 文章管理 | http://localhost:5173/admin |
| 👤 关于 | http://localhost:5173/about |

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts` | 获取文章列表 |
| GET | `/api/posts/:id` | 获取文章详情 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/:id` | 更新文章 |
| DELETE | `/api/posts/:id` | 删除文章 |

## 🛠️ 技术栈

**前端**
- React 19 - UI 框架
- React Router 7 - 路由管理
- Framer Motion - 动画效果
- TailwindCSS 4 - 样式框架
- Vite 7 - 构建工具

**后端**
- Express 4 - Web 框架
- better-sqlite3 - SQLite 数据库驱动
- CORS - 跨域支持

## 📄 License

MIT
