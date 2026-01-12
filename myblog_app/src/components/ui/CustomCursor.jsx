import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Main cursor (dot) - Fast response
    const mainSpringConfig = { stiffness: 1000, damping: 50, mass: 0.1 };
    const mainX = useSpring(mouseX, mainSpringConfig);
    const mainY = useSpring(mouseY, mainSpringConfig);

    // Follower cursor (ring) - High sensitivity as requested
    const followerSpringConfig = { stiffness: 600, damping: 20, mass: 0.2 };
    const followerX = useSpring(mouseX, followerSpringConfig);
    const followerY = useSpring(mouseY, followerSpringConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const cursorRef = useRef(null);

    useEffect(() => {
        const updateMousePosition = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            setIsHidden(false);
        };

        const handleMouseLeave = () => setIsHidden(true);
        const handleMouseEnter = () => setIsHidden(false);

        const handleHoverStart = (e) => {
            const target = e.target;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.classList.contains('cursor-pointer') ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.cursor-pointer')
            ) {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = () => setIsHovering(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseover', handleHoverStart);
        document.addEventListener('mouseout', handleHoverEnd);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseover', handleHoverStart);
            document.removeEventListener('mouseout', handleHoverEnd);
        };
    }, [mouseX, mouseY]);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            {/* Main Dot */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: mainX,
                    y: mainY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                }}
                animate={{
                    scale: isHidden ? 0 : 1,
                    width: isHovering ? 40 : 12,
                    height: isHovering ? 40 : 12,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
            />

            {/* Follower Ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 40,
                    height: 40,
                    border: '1px solid var(--color-accent)',
                    borderRadius: '50%',
                }}
                animate={{
                    scale: isHidden ? 0 : (isHovering ? 1.5 : 1),
                    opacity: isHovering ? 0.3 : 0.15,
                }}
                transition={{
                    scale: {
                        type: 'spring',
                        stiffness: 500,
                        damping: 20
                    },
                    opacity: { duration: 0.2 }
                }}
            />
        </>
    );
}
