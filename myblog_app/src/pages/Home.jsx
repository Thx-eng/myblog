import Hero from '../components/home/Hero';
import FeaturedPosts from '../components/home/FeaturedPosts';

export default function Home() {
    return (
        <>
            <Hero />
            <FeaturedPosts />
            {/* 底部留白 */}
            <div className="h-24" />
        </>
    );
}
