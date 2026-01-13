import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // 检查系统主题偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    };

    const navItems = [
        { path: '/', label: '首页' },
        { path: '/blog', label: '博客' },
        { path: '/about', label: '关于' },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                ? 'py-4 bg-[var(--color-background)]/80 backdrop-blur-md border-[var(--color-border)]'
                : 'py-6 bg-transparent border-transparent'
                }`}
        >
            <nav className="container-custom flex items-center justify-between">
                {/* Logo */}
                <MagneticButton strength={0.2}>
                    <Link
                        to="/"
                        className="font-heading text-2xl font-medium tracking-tight hover:text-[var(--color-accent)] transition-colors"
                    >
                        墨迹
                    </Link>
                </MagneticButton>

                {/* 导航链接 */}
                <ul className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <MagneticButton strength={0.15}>
                                <Link
                                    to={item.path}
                                    className={`relative text-sm font-medium tracking-wide transition-colors ${location.pathname === item.path
                                        ? 'text-[var(--color-primary)]'
                                        : 'text-[var(--color-muted)] hover:text-[var(--color-primary)]'
                                        }`}
                                >
                                    {item.label}
                                    {/* 活动指示器 */}
                                    <AnimatePresence>
                                        {location.pathname === item.path && (
                                            <motion.span
                                                layoutId="navIndicator"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                exit={{ scaleX: 0 }}
                                                className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-accent)]"
                                                style={{ transformOrigin: 'left' }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </MagneticButton>
                        </li>
                    ))}

                    {/* 主题切换 */}
                    <li>
                        <MagneticButton strength={0.15}>
                            <button
                                onClick={toggleTheme}
                                className="w-8 h-8 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                                aria-label="切换主题"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{ rotate: isDark ? 180 : 0 }}
                                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    {isDark ? (
                                        // 月亮图标 - 使用简单线条
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                        </svg>
                                    ) : (
                                        // 太阳图标 - 使用简单线条
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="5" />
                                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                        </svg>
                                    )}
                                </motion.div>
                            </button>
                        </MagneticButton>
                    </li>
                </ul>
            </nav>
        </motion.header>
    );
}
