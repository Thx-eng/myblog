import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../ui/CustomCursor';

export default function Layout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col theme-transition bg-[var(--color-background)]">
            {/* 自定义光标 */}
            <CustomCursor />

            {/* 导航栏 */}
            <Navbar />

            {/* 主内容区 */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* 页脚 */}
            <Footer />
        </div>
    );
}
