import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS 配置
app.use('/*', cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'http://localhost:5174', // 已支持
        'https://myblog-app.pages.dev', // 生产环境前端 (Cloudflare Pages)
        'https://myblog.myblog-thx.workers.dev'
    ],
    credentials: true,
}));

// 简单的认证中间件
const auth = async (c, next) => {
    const authKey = c.req.header('X-Auth-Key');
    const adminPassword = c.env.ADMIN_PASSWORD || '123456';

    if (authKey !== adminPassword) {
        return c.json({ error: '未授权：密码错误' }, 401);
    }
    await next();
};

// 健康检查
app.get('/api/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 验证密码
app.post('/api/verify', auth, (c) => {
    return c.json({ status: 'ok' });
});

// 获取所有文章
app.get('/api/posts', async (c) => {
    try {
        const category = c.req.query('category');
        let posts;

        if (category && category !== '全部') {
            posts = await c.env.DB.prepare(`
        SELECT id, title, excerpt, category, readTime, 
               DATE(createdAt) as date 
        FROM posts 
        WHERE category = ?
        ORDER BY createdAt DESC
      `).bind(category).all();
        } else {
            posts = await c.env.DB.prepare(`
        SELECT id, title, excerpt, category, readTime, 
               DATE(createdAt) as date 
        FROM posts 
        ORDER BY createdAt DESC
      `).all();
        }

        return c.json(posts.results);
    } catch (error) {
        console.error('获取文章列表失败:', error);
        return c.json({ error: '获取文章列表失败' }, 500);
    }
});

// 获取单篇文章
app.get('/api/posts/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const post = await c.env.DB.prepare(`
      SELECT id, title, excerpt, content, category, readTime, 
             DATE(createdAt) as date 
      FROM posts 
      WHERE id = ?
    `).bind(id).first();

        if (!post) {
            return c.json({ error: '文章不存在' }, 404);
        }

        return c.json(post);
    } catch (error) {
        console.error('获取文章失败:', error);
        return c.json({ error: '获取文章失败' }, 500);
    }
});

// 创建文章
app.post('/api/posts', auth, async (c) => {
    try {
        const { title, excerpt, content, category, readTime } = await c.req.json();

        if (!title || !content) {
            return c.json({ error: '标题和内容不能为空' }, 400);
        }

        const result = await c.env.DB.prepare(`
      INSERT INTO posts (title, excerpt, content, category, readTime)
      VALUES (?, ?, ?, ?, ?)
    `).bind(title, excerpt || '', content, category || '随想', readTime || '5 分钟').run();

        return c.json({
            id: result.meta.last_row_id,
            message: '文章创建成功'
        }, 201);
    } catch (error) {
        console.error('创建文章失败:', error);
        return c.json({ error: '创建文章失败' }, 500);
    }
});

// 更新文章
app.put('/api/posts/:id', auth, async (c) => {
    try {
        const id = c.req.param('id');
        const { title, excerpt, content, category, readTime } = await c.req.json();

        const existing = await c.env.DB.prepare('SELECT id FROM posts WHERE id = ?').bind(id).first();
        if (!existing) {
            return c.json({ error: '文章不存在' }, 404);
        }

        await c.env.DB.prepare(`
      UPDATE posts 
      SET title = ?, excerpt = ?, content = ?, category = ?, readTime = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(title, excerpt, content, category, readTime, id).run();

        return c.json({ message: '文章更新成功' });
    } catch (error) {
        console.error('更新文章失败:', error);
        return c.json({ error: '更新文章失败' }, 500);
    }
});

// 删除文章
app.delete('/api/posts/:id', auth, async (c) => {
    try {
        const id = c.req.param('id');

        const result = await c.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

        if (result.meta.changes === 0) {
            return c.json({ error: '文章不存在' }, 404);
        }

        return c.json({ message: '文章删除成功' });
    } catch (error) {
        console.error('删除文章失败:', error);
        return c.json({ error: '删除文章失败' }, 500);
    }
});

// 404 处理
app.notFound((c) => {
    return c.json({ error: '接口不存在' }, 404);
});

// 错误处理
app.onError((err, c) => {
    console.error('服务器错误:', err);
    return c.json({ error: '服务器内部错误' }, 500);
});

export default app;
