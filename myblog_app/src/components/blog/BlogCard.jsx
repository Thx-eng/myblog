import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogCard({ post }) {
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });
    };

    return (
        <motion.article
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="group relative cursor-pointer"
        >
            <Link to={`/article/${post.id}`} className="block">
                {/* 悬停光效 */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"
                    style={{
                        background: isHovered
                            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(45, 90, 84, 0.08), transparent 40%)`
                            : 'none',
                    }}
                />

                {/* 卡片内容 */}
                <div className="relative h-full min-h-[120px] p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] transition-all duration-300 group-hover:border-[var(--color-accent)]/30 flex flex-col">
                    {/* 分类标签 */}
                    <span className="inline-block text-xs tracking-wider text-[var(--color-muted)] uppercase mb-4">
                        {post.category}
                    </span>

                    {/* 标题 */}
                    <h3 className="font-heading text-xl mb-3 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-2">
                        {post.title}
                    </h3>

                    {/* 摘要 */}
                    <p className="text-sm text-[var(--color-secondary)] leading-relaxed mb-6 line-clamp-2 flex-grow">
                        {post.excerpt}
                    </p>

                    {/* 底部信息 */}
                    <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mt-auto">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span>{post.readTime}</span>
                    </div>

                    {/* 底部装饰线 */}
                    <motion.div
                        className="absolute bottom-0 left-6 right-6 h-px bg-[var(--color-accent)]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformOrigin: 'left' }}
                    />
                </div>
            </Link>
        </motion.article>
    );
}
