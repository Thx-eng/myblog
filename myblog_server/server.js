import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
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
