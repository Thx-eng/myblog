import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPosts, createPost, deletePost } from '../api/posts';

const categories = ['前端开发', '设计思考', '随想', '技术', '生活'];

export default function Admin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '随想',
        readTime: '5 分钟',
    });
    const [submitting, setSubmitting] = useState(false);

    // 加载文章列表
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await getPosts();
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 提交新文章
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('请填写标题和内容');
            return;
        }

        try {
            setSubmitting(true);
            await createPost(formData);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                category: '随想',
                readTime: '5 分钟',
            });
            setShowForm(false);
            await loadPosts();
        } catch (err) {
            alert('创建失败: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // 删除文章
    const handleDelete = async (id, title) => {
        if (!confirm(`确定要删除文章「${title}」吗？`)) return;

        try {
            await deletePost(id);
            await loadPosts();
        } catch (err) {
            alert('删除失败: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="pt-40 pb-24 text-center">
                <div className="container-custom">
                    <div className="animate-pulse text-[var(--color-muted)]">加载中...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24" style={{ paddingTop: '50px' }}>
            <div className="container-custom max-w-4xl">
                {/* 页面标题 */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="font-heading text-4xl mb-2">文章管理</h1>
                        <p className="text-[var(--color-muted)]">
                            共 {posts.length} 篇文章
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        {showForm ? '取消' : '+ 新建文章'}
                    </button>
                </div>

                {/* 新建文章表单 */}
                <AnimatePresence>
                    {showForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit}
                            className="mb-12 p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]"
                        >
                            <h2 className="font-heading text-2xl mb-6">创建新文章</h2>

                            <div className="space-y-6">
                                {/* 标题 */}
                                <div>
                                    <label className="block text-sm text-[var(--color-muted)] mb-2">
                                        标题 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                        placeholder="输入文章标题"
                                    />
                                </div>

                                {/* 摘要 */}
                                <div>
                                    <label className="block text-sm text-[var(--color-muted)] mb-2">
                                        摘要
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                        placeholder="简短描述文章内容"
                                    />
                                </div>

                                {/* 分类和阅读时间 */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-[var(--color-muted)] mb-2">
                                            分类
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[var(--color-muted)] mb-2">
                                            阅读时间
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.readTime}
                                            onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                            placeholder="如：5 分钟"
                                        />
                                    </div>
                                </div>

                                {/* 内容 */}
                                <div>
                                    <label className="block text-sm text-[var(--color-muted)] mb-2">
                                        内容 * <span className="text-xs">(支持 HTML 标签)</span>
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={12}
                                        className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none font-mono text-sm"
                                        placeholder="在此输入文章内容，支持 HTML 标签如 <h2>, <p>, <a> 等"
                                    />
                                </div>

                                {/* 提交按钮 */}
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-8 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                                    >
                                        {submitting ? '发布中...' : '发布文章'}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* 错误提示 */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                        {error}
                    </div>
                )}

                {/* 文章列表 */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/article/${post.id}`}
                                        className="font-heading text-xl hover:text-[var(--color-accent)] transition-colors block truncate"
                                    >
                                        {post.title}
                                    </Link>
                                    <p className="text-[var(--color-muted)] text-sm mt-1 truncate">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3 text-xs text-[var(--color-muted)]">
                                        <span className="px-2 py-1 bg-[var(--color-background)] rounded">
                                            {post.category}
                                        </span>
                                        <span>{post.date}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(post.id, post.title)}
                                    className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                    删除
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {posts.length === 0 && !loading && (
                        <div className="text-center py-16 text-[var(--color-muted)]">
                            还没有文章，点击上方按钮创建第一篇吧！
                        </div>
                    )}
                </div>

                {/* 返回链接 */}
                <div className="mt-12 text-center">
                    <Link
                        to="/blog"
                        className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors link-underline"
                    >
                        ← 返回博客
                    </Link>
                </div>
            </div>
        </div>
    );
}
