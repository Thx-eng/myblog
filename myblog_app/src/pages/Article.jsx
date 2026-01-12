import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import { getPost } from '../api/posts';

export default function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPost(id);
                setArticle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-40 pb-24 text-center">
                <div className="container-custom">
                    <div className="animate-pulse text-[var(--color-muted)]">加载中...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-40 pb-24 text-center">
                <div className="container-custom">
                    <h1 className="font-heading text-4xl mb-4 text-red-400">加载失败</h1>
                    <p className="text-[var(--color-muted)] mb-4">{error}</p>
                    <Link to="/blog" className="text-[var(--color-accent)] link-underline">
                        返回博客列表
                    </Link>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="pt-40 pb-24 text-center">
                <div className="container-custom">
                    <h1 className="font-heading text-4xl mb-4">文章不存在</h1>
                    <Link to="/blog" className="text-[var(--color-accent)] link-underline">
                        返回博客列表
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article className="pb-24" style={{ paddingTop: '50px' }}>
            <div className="container-custom">
                <div className="max-w-2xl mx-auto">
                    {/* 文章头部 */}
                    <header className="mb-12">
                        <ScrollReveal delay={0.2}>
                            <div className="flex items-start gap-4 mb-6">
                                <Link
                                    to="/blog"
                                    className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all flex-shrink-0"
                                    style={{ marginTop: '20px' }} aria-label="返回博客"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="transform transition-transform group-hover:-translate-x-0.5"
                                    >
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl flex-1 leading-tight">
                                    {article.title}
                                </h1>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.3}>
                            <div className="flex items-center gap-4 text-sm text-[var(--color-muted)] pl-12 md:pl-14">
                                <time dateTime={article.date}>
                                    {new Date(article.date).toLocaleDateString('zh-CN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                <span>·</span>
                                <span>{article.readTime}</span>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.4}>
                            <div className="w-full h-px bg-[var(--color-border)] mt-8" />
                        </ScrollReveal>
                    </header>

                    {/* 文章内容 */}
                    <ScrollReveal delay={0.5}>
                        <motion.div
                            className="prose prose-lg max-w-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                            style={{
                                '--tw-prose-body': 'var(--color-secondary)',
                                '--tw-prose-headings': 'var(--color-primary)',
                                '--tw-prose-links': 'var(--color-accent)',
                            }}
                        />
                    </ScrollReveal>

                    {/* 文章底部 */}
                    <ScrollReveal delay={0.6}>
                        <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
                            <p className="text-sm text-[var(--color-muted)] text-center">
                                感谢阅读，如有任何想法欢迎交流
                            </p>
                        </footer>
                    </ScrollReveal>
                </div>
            </div>

            {/* 文章内容样式 */}
            <style>{`
        .prose h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: var(--color-secondary);
        }
        
        .prose a {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .prose a:hover {
          color: var(--color-accent-light);
        }
      `}</style>
        </article>
    );
}
