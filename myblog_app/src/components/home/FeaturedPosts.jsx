import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import BlogCard from '../blog/BlogCard';
import { getPosts } from '../../api/posts';

export default function FeaturedPosts() {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await getPosts();
                // 只取前3篇
                setFeaturedPosts(data.slice(0, 3));
            } catch (err) {
                console.error('加载文章失败:', err);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    return (
        <section className="py-24 bg-[var(--color-background)]">
            <div className="container-custom">
                {/* 标题区 */}
                <ScrollReveal>
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="font-heading text-3xl md:text-4xl mb-2">
                                最新文章
                            </h2>
                            <div className="w-16 h-px bg-[var(--color-accent)]" />
                        </div>

                        <Link
                            to="/blog"
                            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors link-underline hidden md:block"
                        >
                            查看全部
                        </Link>
                    </div>
                </ScrollReveal>

                {/* 间距 */}
                <div className="h-2 md:h-4" />

                {/* 加载状态 */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-pulse text-[var(--color-muted)]">加载中...</div>
                    </div>
                ) : featuredPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-[var(--color-muted)]">暂无文章</p>
                    </div>
                ) : (
                    /* 文章网格 */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPosts.map((post, index) => (
                            <ScrollReveal key={post.id} delay={index * 0.1}>
                                <BlogCard post={post} />
                            </ScrollReveal>
                        ))}
                    </div>
                )}

                {/* 移动端查看全部链接 */}
                <ScrollReveal delay={0.3}>
                    <div className="mt-12 text-center md:hidden">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                        >
                            <span className="link-underline">查看全部文章</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
