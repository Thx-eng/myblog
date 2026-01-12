import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// 获取所有文章
router.get('/', (req, res) => {
    try {
        const { category } = req.query;
        let posts;

        if (category && category !== '全部') {
            posts = db.prepare(`
        SELECT id, title, excerpt, category, readTime, 
               DATE(createdAt) as date 
        FROM posts 
        WHERE category = ?
        ORDER BY createdAt DESC
      `).all(category);
        } else {
            posts = db.prepare(`
        SELECT id, title, excerpt, category, readTime, 
               DATE(createdAt) as date 
        FROM posts 
        ORDER BY createdAt DESC
      `).all();
        }

        res.json(posts);
    } catch (error) {
        console.error('获取文章列表失败:', error);
        res.status(500).json({ error: '获取文章列表失败' });
    }
});

// 获取单篇文章
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const post = db.prepare(`
      SELECT id, title, excerpt, content, category, readTime, 
             DATE(createdAt) as date 
      FROM posts 
      WHERE id = ?
    `).get(id);

        if (!post) {
            return res.status(404).json({ error: '文章不存在' });
        }

        res.json(post);
    } catch (error) {
        console.error('获取文章失败:', error);
        res.status(500).json({ error: '获取文章失败' });
    }
});

// 创建文章
router.post('/', (req, res) => {
    try {
        const { title, excerpt, content, category, readTime } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: '标题和内容不能为空' });
        }

        const result = db.prepare(`
      INSERT INTO posts (title, excerpt, content, category, readTime)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, excerpt || '', content, category || '随想', readTime || '5 分钟');

        res.status(201).json({
            id: result.lastInsertRowid,
            message: '文章创建成功'
        });
    } catch (error) {
        console.error('创建文章失败:', error);
        res.status(500).json({ error: '创建文章失败' });
    }
});

// 更新文章
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, category, readTime } = req.body;

        const existing = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: '文章不存在' });
        }

        db.prepare(`
      UPDATE posts 
      SET title = ?, excerpt = ?, content = ?, category = ?, readTime = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, excerpt, content, category, readTime, id);

        res.json({ message: '文章更新成功' });
    } catch (error) {
        console.error('更新文章失败:', error);
        res.status(500).json({ error: '更新文章失败' });
    }
});

// 删除文章
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: '文章不存在' });
        }

        res.json({ message: '文章删除成功' });
    } catch (error) {
        console.error('删除文章失败:', error);
        res.status(500).json({ error: '删除文章失败' });
    }
});

export default router;
