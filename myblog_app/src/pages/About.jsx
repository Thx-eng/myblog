import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import MagneticButton from '../components/ui/MagneticButton';

export default function About() {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('2311995@mail.nankai.edu.cn');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pb-24" style={{ paddingTop: '50px' }}>
            <div className="container-custom">
                <div className="max-w-2xl mx-auto">
                    {/* 标题 */}
                    <ScrollReveal>
                        <h1 className="font-heading text-4xl md:text-5xl mb-6">
                            关于我
                        </h1>
                        <div className="w-16 h-px bg-[var(--color-accent)] mb-12" />
                    </ScrollReveal>

                    {/* 简介 */}
                    <ScrollReveal delay={0.1}>
                        <div className="space-y-6 text-[var(--color-secondary)] leading-relaxed">
                            <p>
                                你好，我是一名热爱技术与设计的开发者。
                            </p>

                            <p>
                                我相信好的产品来自于对细节的专注和对用户的同理心。
                                在我的职业生涯中，我始终追求技术与美学的平衡，
                                致力于创造既实用又优雅的数字体验。
                            </p>

                            <p>
                                这个博客是我记录思考、分享经验的地方。
                                在这里，你会看到关于前端开发、设计思维和生活感悟的文章。
                                每一篇都是我对某个话题深入思考后的沉淀。
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* 技能 */}
                    <ScrollReveal delay={0.2}>
                        <div className="mt-16">
                            <h2 className="font-heading text-2xl mb-6">专注领域</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {['前端开发', '用户体验', '设计系统', '性能优化'].map((skill, index) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 border border-[var(--color-border)] rounded-lg"
                                    >
                                        <span className="text-sm text-[var(--color-primary)]">{skill}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 联系方式 */}
                    <ScrollReveal delay={0.3}>
                        <div className="mt-16">
                            <h2 className="font-heading text-2xl mb-6">保持联系</h2>
                            <p className="text-[var(--color-secondary)] mb-6">
                                如果你对我的文章有任何想法，或者想一起探讨技术与设计，
                                欢迎通过以下方式与我联系。
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <MagneticButton>
                                    <button
                                        onClick={handleCopyEmail}
                                        className="relative inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-sm rounded-full hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                                    >
                                        <AnimatePresence mode='wait'>
                                            {copied ? (
                                                <motion.span
                                                    key="copied"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    已复制
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="label"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                >
                                                    发送邮件
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </MagneticButton>

                                <MagneticButton>
                                    <a
                                        href="https://github.com/Thx-eng/myblog.git"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-sm rounded-full hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                                    >
                                        GitHub
                                    </a>
                                </MagneticButton>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 引用 */}
                    <ScrollReveal delay={0.4}>
                        <blockquote className="mt-16 p-8 border-l-2 border-[var(--color-accent)] bg-[var(--color-surface)]">
                            <p className="font-heading text-xl italic text-[var(--color-primary)] mb-4">
                                "简约是终极的复杂。"
                            </p>
                            <cite className="text-sm text-[var(--color-muted)] not-italic">
                                — 列奥纳多·达·芬奇
                            </cite>
                        </blockquote>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
