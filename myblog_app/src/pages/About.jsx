import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ui/ScrollReveal';
import MagneticButton from '../components/ui/MagneticButton';

// 引用列表
const quotes = [
    { text: "简约是终极的复杂。", author: "列奥纳多·达·芬奇" },
    { text: "好的设计是尽可能少的设计。", author: "迪特·拉姆斯" },
    { text: "代码是写给人看的，只是偶尔让计算机执行一下。", author: "Donald Knuth" },
    { text: "完美不是无以复加，而是无可删减。", author: "安托万·德·圣埃克苏佩里" },
    { text: "先让它工作，再让它正确，最后让它快。", author: "Kent Beck" },
];

export default function About() {
    const [copied, setCopied] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [showAuthor, setShowAuthor] = useState(false);

    // 打字机效果
    useEffect(() => {
        const currentQuote = quotes[quoteIndex].text;

        if (isTyping) {
            if (displayText.length < currentQuote.length) {
                const timer = setTimeout(() => {
                    setDisplayText(currentQuote.slice(0, displayText.length + 1));
                }, 100); // 打字速度
                return () => clearTimeout(timer);
            } else {
                // 打字完成，显示作者
                setShowAuthor(true);
                const timer = setTimeout(() => {
                    setIsTyping(false);
                }, 3000); // 停留时间
                return () => clearTimeout(timer);
            }
        } else {
            // 切换到下一条引用
            setShowAuthor(false);
            setDisplayText('');
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
            setIsTyping(true);
        }
    }, [displayText, isTyping, quoteIndex]);

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
                        <div className="space-y-6 text-[var(--color-secondary)] leading-relaxed mb-16">
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


                    {/* 联系方式 */}
                    <ScrollReveal delay={0.3}>
                        <div style={{ marginTop: '20px' }}>
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

                    {/* 引用 - 打字机效果 */}
                    <ScrollReveal delay={0.4}>
                        <blockquote className="mt-24 p-8 border-l-2 border-[var(--color-accent)] bg-[var(--color-surface)] min-h-[50px]">
                            <p className="font-heading text-xl italic text-[var(--color-primary)] mb-4">
                                "{displayText}
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                    className="inline-block w-[2px] h-5 bg-[var(--color-accent)] ml-1 align-middle"
                                />
                                "
                            </p>
                            <AnimatePresence>
                                {showAuthor && (
                                    <motion.cite
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm text-[var(--color-muted)] not-italic block"
                                    >
                                        — {quotes[quoteIndex].author}
                                    </motion.cite>
                                )}
                            </AnimatePresence>
                        </blockquote>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}

