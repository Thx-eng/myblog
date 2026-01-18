import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import BlogCard from '../components/blog/BlogCard';
import { getPosts } from '../api/posts';

const categories = ['全部', '前端开发', '设计思考', '随想', '技术', '生活'];

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('全部');
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 从 API 加载文章
    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPosts();
                setAllPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    const filteredPosts = activeCategory === '全部'
        ? allPosts
        : allPosts.filter(post => post.category === activeCategory);

    return (
        <div className="pb-24" style={{ paddingTop: '72px', paddingBottom: 'max(6rem, calc(160px + env(safe-area-inset-bottom, 0px)))' }}>
            <div className="container-custom">
                {/* 页面标题 */}
                <ScrollReveal>
                    <div className="max-w-2xl mb-16">
                        <h1 className="font-heading text-4xl md:text-5xl mb-4">
                            博客
                        </h1>
                        <p className="text-[var(--color-secondary)]">
                            记录学习、思考与创造的过程
                        </p>
                        <div className="w-16 h-px bg-[var(--color-accent)] mt-6" />
                    </div>
                </ScrollReveal>

                {/* 错误提示 */}
                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                        加载失败: {error}
                    </div>
                )}

                {/* 分类筛选 */}
                <ScrollReveal delay={0.1}>
                    <div className="flex flex-wrap gap-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm transition-all duration-300 cursor-pointer ${activeCategory === category
                                    ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-accent)]'
                                    : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </ScrollReveal>

                {/* 间距 */}
                <div className="h-4 md:h-8" />

                {/* 文章网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!loading && filteredPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.02 }}
                        >
                            <BlogCard post={post} />
                        </motion.div>
                    ))}
                </div>

                {/* 空状态 */}
                {filteredPosts.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <p className="text-[var(--color-muted)]">暂无此分类的文章</p>
                    </div>
                )}
            </div>
        </div >
    );
}
