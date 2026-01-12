import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import MagneticButton from '../ui/MagneticButton';

export default function Hero() {
    const containerRef = useRef(null);

    // 鼠标视差效果
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;

            container.style.setProperty('--mouse-x', xPercent);
            container.style.setProperty('--mouse-y', yPercent);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* 背景装饰 - 微妙的渐变 */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `
            radial-gradient(
              ellipse at calc(50% + calc(var(--mouse-x, 0) * 5%)) calc(50% + calc(var(--mouse-y, 0) * 5%)),
              var(--color-accent) 0%,
              transparent 50%
            )
          `,
                    filter: 'blur(80px)',
                    transition: 'all 0.3s ease-out',
                }}
            />

            {/* 主内容 */}
            <div className="container-custom text-center relative z-10">
                {/* 问候语 */}
                <ScrollReveal delay={0.1}>
                    <motion.p
                        className="text-sm tracking-[0.3em] text-[var(--color-muted)] uppercase mb-6"
                        initial={{ letterSpacing: '0.5em', opacity: 0 }}
                        animate={{ letterSpacing: '0.3em', opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        你好，欢迎来到
                    </motion.p>
                </ScrollReveal>

                {/* 主标题 */}
                <ScrollReveal delay={0.2}>
                    <h1 className="font-heading mb-6">
                        <motion.span
                            className="inline-block"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        >
                            墨迹
                        </motion.span>
                    </h1>
                </ScrollReveal>

                {/* 副标题 */}
                <ScrollReveal delay={0.4}>
                    <p className="text-lg md:text-xl text-[var(--color-secondary)] max-w-lg mx-auto mb-4">
                        一个热爱设计与创作的开发者的思考空间
                    </p>
                </ScrollReveal>

                {/* 分隔装饰线 */}
                <ScrollReveal delay={0.5}>
                    <motion.div
                        className="w-12 h-px bg-[var(--color-accent)] mx-auto my-8"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        style={{ transformOrigin: 'center' }}
                    />
                </ScrollReveal>

                {/* 简介 */}
                <ScrollReveal delay={0.6}>
                    <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
                        分享编程心得、设计思考与生活感悟
                    </p>
                </ScrollReveal>

                {/* 向下滚动提示 */}
                <ScrollReveal delay={0.8}>
                    <MagneticButton className="mt-16">
                        <button
                            onClick={scrollToContent}
                            className="group flex flex-col items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                            aria-label="向下滚动"
                        >
                            <span className="text-xs tracking-widest uppercase">探索更多</span>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    className="transform group-hover:translate-y-1 transition-transform"
                                >
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </motion.div>
                        </button>
                    </MagneticButton>
                </ScrollReveal>
            </div>

            {/* 底部渐变遮罩 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
        </section>
    );
}
