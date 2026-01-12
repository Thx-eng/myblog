import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            label: 'Email',
            href: 'mailto:hello@example.com',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            )
        },
        {
            label: 'GitHub',
            href: 'https://github.com',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 3C6.77 6.5 6.73 6.1 4 6.24c0 0-1 0-3-1.5C.2 5.9.2 7.1 1 8.24c-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
            )
        }
    ];

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
        >
            <div className="container-custom py-4 max-w-2xl mx-auto flex flex-col gap-2">

                {/* 第一行：Brand + Slogan + Social */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="font-heading text-xl font-medium tracking-tight"
                        >
                            墨迹
                        </Link>
                        <div className="h-4 w-[1px] bg-[var(--color-border)] hidden md:block"></div>
                        <p className="text-sm text-[var(--color-secondary)] hidden md:block">
                            探索技术与设计的边界，记录思考，分享生活
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {socialLinks.map((link) => (
                            <MagneticButton key={link.label} strength={0.2}>
                                <a
                                    href={link.href}
                                    target={link.href.startsWith('http') ? "_blank" : undefined}
                                    rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-full transition-colors duration-300 group bg-[var(--color-background)]"
                                >
                                    <span className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                                        {link.icon}
                                    </span>
                                    <span className="text-sm text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors font-medium">
                                        {link.label}
                                    </span>
                                </a>
                            </MagneticButton>
                        ))}
                    </div>
                </div>

                {/* 第二行：Copyright + Location */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[var(--color-muted)]">
                    <div>
                        © {currentYear} 墨迹 · Built with React & Tailwind
                    </div>
                    <div>
                        Shanghai, China
                    </div>
                </div>

            </div>
        </motion.footer>
    );
}
