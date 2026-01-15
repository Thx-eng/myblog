import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playlist } from '../../data/playlist';

// 图标组件
const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21" />
    </svg>
);

const PauseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
    </svg>
);

const PrevIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="19,20 9,12 19,4" />
        <rect x="5" y="4" width="3" height="16" />
    </svg>
);

const NextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,4 15,12 5,20" />
        <rect x="16" y="4" width="3" height="16" />
    </svg>
);

const VolumeIcon = ({ muted }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
        {!muted && (
            <>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
        )}
        {muted && <line x1="23" y1="9" x2="17" y2="15" />}
    </svg>
);

const MusicNoteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </svg>
);

const MinimizeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// 格式化时间
const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MusicPlayer() {
    const audioRef = useRef(null);
    const progressRef = useRef(null);
    const shouldAutoPlayRef = useRef(false); // 跟踪是否应该自动播放

    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isDocked, setIsDocked] = useState(false); // 移动端边缘收缩模式
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const currentSong = playlist[currentIndex] || { title: '无歌曲', artist: '', src: '' };

    // 播放/暂停控制
    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong.src) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
    }, [isPlaying, currentSong.src]);

    // 切换歌曲
    const changeSong = useCallback((direction, autoPlay = false) => {
        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = playlist.length - 1;
        if (newIndex >= playlist.length) newIndex = 0;
        // 如果指定自动播放，或者当前正在播放，切换后继续播放
        shouldAutoPlayRef.current = autoPlay || isPlaying;
        setCurrentIndex(newIndex);
        setCurrentTime(0);
    }, [currentIndex, isPlaying]);

    // 音量控制
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        if (newVolume > 0) setIsMuted(false);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // 进度条点击/触摸
    const handleProgressInteraction = useCallback((clientX) => {
        const rect = progressRef.current?.getBoundingClientRect();
        if (!rect) return;
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const audioDuration = audioRef.current?.duration || 0;
        const newTime = percent * audioDuration;
        if (audioRef.current && audioDuration > 0) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }, []);

    // 鼠标拖动进度条
    const isDraggingRef = useRef(false);
    const wasPlayingRef = useRef(false); // 记录拖动前是否在播放

    // 为进度条添加鼠标拖动事件
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDraggingRef.current) return;
            const rect = progressRef.current?.getBoundingClientRect();
            if (rect && audioRef.current?.duration) {
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = percent * audioRef.current.duration;
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        const handleMouseUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            // 拖动结束后恢复播放
            if (wasPlayingRef.current && audioRef.current) {
                audioRef.current.play().catch(console.error);
                wasPlayingRef.current = false;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // 检测移动端
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 移动端自动收缩到边缘（几秒后）
    useEffect(() => {
        if (!isMobile || !isVisible || isExpanded) return;
        const timer = setTimeout(() => {
            setIsDocked(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, [isMobile, isVisible, isExpanded, isPlaying]);

    // 音频事件处理
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => changeSong(1, true); // 自动播放下一首
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        audio.volume = volume;

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [volume, changeSong]);

    // 歌曲切换时自动播放
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong.src) return;

        audio.load();
        // 如果设置了自动播放标志，则播放
        if (shouldAutoPlayRef.current) {
            audio.play().catch(console.error);
            shouldAutoPlayRef.current = false;
        }
    }, [currentIndex, currentSong.src]);

    // 关闭播放器（暂停并隐藏）
    const handleClose = useCallback(() => {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
            audio.pause();
        }
        setIsVisible(false);
    }, []);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <>
            {/* audio 元素始终保持挂载 */}
            <audio ref={audioRef} src={currentSong.src} preload="metadata" />

            {/* 隐藏时只显示小按钮 */}
            {!isVisible && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setIsVisible(true)}
                    className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-lg hover:border-[var(--color-accent)] transition-colors"
                    title="打开音乐播放器"
                >
                    <MusicNoteIcon />
                </motion.button>
            )}

            {isVisible && (
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        // 展开模式
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-24 right-6 z-50 w-72 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* 标题栏 */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
                                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                                    <div
                                        style={{
                                            animation: isPlaying ? 'spin 3s linear infinite' : 'none'
                                        }}
                                    >
                                        <MusicNoteIcon />
                                    </div>
                                    <span className="text-sm font-medium">音乐播放器</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="p-1.5 rounded-md hover:bg-[var(--color-border)] transition-colors text-[var(--color-muted)]"
                                        title="收起"
                                    >
                                        <MinimizeIcon />
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="p-1.5 rounded-md hover:bg-[var(--color-border)] transition-colors text-[var(--color-muted)]"
                                        title="关闭"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>

                            {/* 歌曲信息 */}
                            <div className="px-4 py-3">
                                <h4 className="text-sm font-medium text-[var(--color-primary)] truncate">
                                    {currentSong.title}
                                </h4>
                                <p className="text-xs text-[var(--color-muted)] truncate">
                                    {currentSong.artist}
                                </p>
                            </div>

                            {/* 进度条 */}
                            <div className="px-4 pb-2">
                                <div
                                    ref={progressRef}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        isDraggingRef.current = true;
                                        // 暂停播放避免炸音
                                        if (audioRef.current && !audioRef.current.paused) {
                                            wasPlayingRef.current = true;
                                            audioRef.current.pause();
                                        } else {
                                            wasPlayingRef.current = false;
                                        }
                                        // 计算并设置新时间
                                        const rect = progressRef.current?.getBoundingClientRect();
                                        if (rect && audioRef.current?.duration) {
                                            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                            const newTime = percent * audioRef.current.duration;
                                            audioRef.current.currentTime = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    onTouchStart={(e) => {
                                        // 触摸开始时暂停播放
                                        if (audioRef.current && !audioRef.current.paused) {
                                            wasPlayingRef.current = true;
                                            audioRef.current.pause();
                                        } else {
                                            wasPlayingRef.current = false;
                                        }
                                        // 计算并设置新时间
                                        const touch = e.touches[0];
                                        const rect = progressRef.current?.getBoundingClientRect();
                                        if (rect && audioRef.current?.duration) {
                                            const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                                            const newTime = percent * audioRef.current.duration;
                                            audioRef.current.currentTime = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    onTouchMove={(e) => {
                                        const touch = e.touches[0];
                                        const rect = progressRef.current?.getBoundingClientRect();
                                        if (rect && audioRef.current?.duration) {
                                            const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                                            const newTime = percent * audioRef.current.duration;
                                            audioRef.current.currentTime = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    onTouchEnd={() => {
                                        // 触摸结束后恢复播放
                                        if (wasPlayingRef.current && audioRef.current) {
                                            audioRef.current.play().catch(console.error);
                                            wasPlayingRef.current = false;
                                        }
                                    }}
                                    className="relative h-3 md:h-1.5 bg-[var(--color-border)] rounded-full cursor-pointer group"
                                    style={{ touchAction: 'none' }}
                                >
                                    <motion.div
                                        className="absolute left-0 top-0 h-full bg-[var(--color-accent)] rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                    <motion.div
                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-3 md:h-3 bg-[var(--color-accent)] rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        style={{ left: `calc(${progress}% - 8px)` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-[var(--color-muted)]">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* 播放控制 */}
                            <div className="flex items-center justify-center gap-4 py-3">
                                <button
                                    onClick={() => changeSong(-1)}
                                    className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                                    title="上一曲"
                                >
                                    <PrevIcon />
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="p-3 rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors shadow-md"
                                    title={isPlaying ? '暂停' : '播放'}
                                >
                                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                </button>
                                <button
                                    onClick={() => changeSong(1)}
                                    className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                                    title="下一曲"
                                >
                                    <NextIcon />
                                </button>
                            </div>

                            {/* 音量控制 */}
                            <div className="flex items-center gap-2 px-4 pb-4">
                                <button
                                    onClick={toggleMute}
                                    className="p-1 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                                    title={isMuted ? '取消静音' : '静音'}
                                >
                                    <VolumeIcon muted={isMuted} />
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[var(--color-accent)]
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        // 迷你模式 / 边缘收缩模式
                        <motion.button
                            key="mini"
                            initial={{ opacity: 0, scale: 0, x: 0 }}
                            animate={{
                                opacity: isDocked ? 0.4 : 1,
                                scale: isDocked ? 0.7 : 1,
                                x: isDocked ? 20 : 0
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            whileHover={{ opacity: 1, scale: 1.1, x: 0 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsDocked(false);
                                setIsExpanded(true);
                            }}
                            className="fixed bottom-24 right-2 md:right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] flex items-center justify-center shadow-lg hover:border-[var(--color-accent)] transition-colors group"
                            title="展开播放器"
                        >
                            <div
                                style={{
                                    animation: isPlaying ? 'spin 3s linear infinite' : 'none'
                                }}
                                className="text-[var(--color-accent)]"
                            >
                                <MusicNoteIcon />
                            </div>
                            {isPlaying && !isDocked && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)]"
                                    initial={{ scale: 1, opacity: 0.8 }}
                                    animate={{ scale: 1.3, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            )}
        </>
    );
}
