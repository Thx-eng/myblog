import { useEffect, useRef, useCallback } from 'react';

/**
 * 微妙的星空粒子背景组件
 * 使用 Canvas 绘制，性能优化，支持暗色/亮色模式
 */
export default function ParticleBackground() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: null, y: null });
    const lastDimensionsRef = useRef({ width: 0, height: 0 });

    // 检测是否为暗色模式
    const isDarkMode = useCallback(() => {
        return document.documentElement.classList.contains('dark');
    }, []);

    // 初始化粒子
    const initParticles = useCallback((canvas) => {
        const particles = [];
        // 基于屏幕大小动态调整粒子数量，保持微妙感
        const particleCount = Math.floor((canvas.width * canvas.height) / 25000);
        const count = Math.min(Math.max(particleCount, 30), 80); // 限制在 30-80 之间

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5, // 0.5-2px
                speedX: (Math.random() - 0.5) * 0.15, // 更慢的移动速度
                speedY: (Math.random() - 0.5) * 0.15,
                opacity: Math.random() * 0.4 + 0.1, // 低透明度，更微妙
                twinkleSpeed: Math.random() * 0.02 + 0.005, // 闪烁速度
                twinklePhase: Math.random() * Math.PI * 2,
            });
        }
        return particles;
    }, []);

    // 绘制函数
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = particlesRef.current;
        const dark = isDarkMode();

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新和绘制粒子
        particles.forEach((particle) => {
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // 边界处理 - 循环
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // 闪烁效果
            particle.twinklePhase += particle.twinkleSpeed;
            const twinkle = Math.sin(particle.twinklePhase) * 0.3 + 0.7;
            const currentOpacity = particle.opacity * twinkle;

            // 鼠标交互 - 距离越近粒子越亮
            if (mouseRef.current.x !== null) {
                const dx = particle.x - mouseRef.current.x;
                const dy = particle.y - mouseRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const influence = 1 - distance / maxDistance;
                    particle.currentOpacity = Math.min(currentOpacity + influence * 0.4, 0.8);
                } else {
                    particle.currentOpacity = currentOpacity;
                }
            } else {
                particle.currentOpacity = currentOpacity;
            }

            // 绘制粒子
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

            // 根据主题设置颜色
            if (dark) {
                // 暗色模式：使用主题强调色的浅色变体
                ctx.fillStyle = `rgba(124, 206, 204, ${particle.currentOpacity})`; // --color-accent-light
            } else {
                // 亮色模式：使用更深的颜色
                ctx.fillStyle = `rgba(45, 90, 84, ${particle.currentOpacity * 0.6})`; // --color-accent
            }

            ctx.fill();
        });

        // 绘制粒子间的连线（仅在粒子靠近时）
        const connectionDistance = 100;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    if (dark) {
                        ctx.strokeStyle = `rgba(124, 206, 204, ${opacity})`;
                    } else {
                        ctx.strokeStyle = `rgba(45, 90, 84, ${opacity * 0.5})`;
                    }

                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animationRef.current = requestAnimationFrame(draw);
    }, [isDarkMode]);

    // 处理画布尺寸
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const lastDimensions = lastDimensionsRef.current;

        // 检测是否是首次初始化或真正的尺寸变化
        const isFirstInit = lastDimensions.width === 0;
        const widthChanged = Math.abs(newWidth - lastDimensions.width) > 10;
        // 移动端地址栏隐藏/显示通常导致约 50-80px 的高度变化，设置阈值为 100px
        const heightChangedSignificantly = Math.abs(newHeight - lastDimensions.height) > 100;

        canvas.width = newWidth;
        canvas.height = newHeight;

        if (isFirstInit || widthChanged || heightChangedSignificantly) {
            // 首次初始化或真正的尺寸变化：重新创建粒子
            particlesRef.current = initParticles(canvas);
            lastDimensionsRef.current = { width: newWidth, height: newHeight };
        } else {
            // 移动端滚动导致的小幅高度变化：只调整超出边界的粒子位置
            particlesRef.current.forEach((particle) => {
                if (particle.x > newWidth) particle.x = newWidth * Math.random();
                if (particle.y > newHeight) particle.y = newHeight * Math.random();
            });
            // 更新记录的高度
            lastDimensionsRef.current.height = newHeight;
        }
    }, [initParticles]);

    // 鼠标移动处理
    const handleMouseMove = useCallback((e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = { x: null, y: null };
    }, []);

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // 开始动画
        animationRef.current = requestAnimationFrame(draw);

        // 监听主题变化
        const observer = new MutationObserver(() => {
            // 主题变化时不需要重新初始化粒子，只需重新绘制
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            observer.disconnect();
        };
    }, [handleResize, handleMouseMove, handleMouseLeave, draw]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: 0,
            }}
            aria-hidden="true"
        />
    );
}
