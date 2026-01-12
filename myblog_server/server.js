import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 配置 - 允许前端域名访问
const allowedOrigins = [
    'http://localhost:5173',  // Vite 开发服务器
    'http://localhost:4173',  // Vite 预览服务器
    process.env.FRONTEND_URL  // 生产环境前端地址（在 Railway 中配置）
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// 路由
app.use('/api/posts', postsRouter);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`博客 API 服务器运行在 http://localhost:${PORT}`);
    console.log(`文章接口: http://localhost:${PORT}/api/posts`);
});
