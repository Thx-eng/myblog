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
    const preloadCacheRef = useRef({}); // 缓存预加载的 Audio 对象，防止被垃圾回收

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
    const [isFullyBuffered, setIsFullyBuffered] = useState(false); // 追踪音频是否完全缓冲

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
    const targetTimeRef = useRef(0); // 保存拖动时的目标时间
    const touchStartValidRef = useRef(false); // 记录 onTouchStart 是否成功处理

    // 为进度条添加鼠标拖动事件
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDraggingRef.current) return;
            const rect = progressRef.current?.getBoundingClientRect();
            const audioDuration = audioRef.current?.duration;
            if (rect && Number.isFinite(audioDuration) && audioDuration > 0) {
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = percent * audioDuration;
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
                // 强制更新 duration 状态
                if (duration !== audioDuration) {
                    setDuration(audioDuration);
                }
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
        if (!isMobile || isExpanded) return;
        const timer = setTimeout(() => {
            setIsDocked(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, [isMobile, isVisible, isExpanded, isPlaying]);

    // 音频事件处理
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            // 拖动过程中不更新，避免进度条闪回 0
            if (!isDraggingRef.current && !wasPlayingRef.current) {
                setCurrentTime(audio.currentTime);
            }
        };
        const handleDurationChange = () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => changeSong(1, true); // 自动播放下一首
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        // 调试：监控 seeking 事件
        const handleSeeking = () => {
            const seekable = audio.seekable;
            const seekableRanges = [];
            for (let i = 0; i < seekable.length; i++) {
                seekableRanges.push(`${seekable.start(i).toFixed(2)}-${seekable.end(i).toFixed(2)}`);
            }
            console.log('[MusicPlayer] Seeking to:', audio.currentTime.toFixed(2),
                '| Seekable ranges:', seekableRanges.join(', ') || 'none',
                '| Duration:', audio.duration?.toFixed(2) || 'NaN',
                '| ReadyState:', audio.readyState);
        };

        // 调试：监控 error 事件
        const handleError = (e) => {
            console.error('[MusicPlayer] Audio error:', audio.error?.message, audio.error?.code, e);
        };

        // 监控 progress 事件（缓冲进度）
        const handleProgress = () => {
            const buffered = audio.buffered;
            if (buffered.length > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
                const bufferedEnd = buffered.end(buffered.length - 1);
                // 检查是否完全缓冲（允许 0.5 秒误差）
                if (bufferedEnd >= audio.duration - 0.5) {
                    setIsFullyBuffered(true);
                }
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleDurationChange);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('seeking', handleSeeking);
        audio.addEventListener('error', handleError);
        audio.addEventListener('progress', handleProgress);

        audio.volume = volume;

        // 初始化检查：如果已经有 duration，立即更新
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
        }

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleDurationChange);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('seeking', handleSeeking);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('progress', handleProgress);
        };
    }, [volume, changeSong]);

    // 歌曲切换时加载
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong.src) return;

        // 只重置 currentTime，保留 duration 直到新的 duration 准备好
        // setDuration(0); // 不重置 duration，避免第一次交互时检查失败
        setCurrentTime(0);

        // 更新 duration 的函数
        const updateDuration = () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                setDuration(audio.duration);
            }
        };

        // 监听多个事件确保能获取到 duration
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('durationchange', updateDuration);
        audio.addEventListener('canplay', updateDuration);

        // 设置 src 并加载音频（确保事件监听器先注册）
        audio.src = currentSong.src;
        audio.load();

        // 备用方案：多次延迟检查 duration（防止事件被错过）
        const timer1 = setTimeout(updateDuration, 100);
        const timer2 = setTimeout(updateDuration, 500);
        const timer3 = setTimeout(updateDuration, 1000);

        // 如果设置了自动播放标志，则播放
        if (shouldAutoPlayRef.current) {
            audio.play().catch(console.error);
            shouldAutoPlayRef.current = false;
        }

        // 预加载上一首和下一首歌，减少切歌等待时间
        const nextIndex = (currentIndex + 1) % playlist.length;
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;

        [nextIndex, prevIndex].forEach(idx => {
            const song = playlist[idx];
            if (song?.src && idx !== currentIndex && !preloadCacheRef.current[song.src]) {
                const preloadAudio = new Audio();
                preloadAudio.preload = 'auto';
                preloadAudio.src = song.src;
                preloadCacheRef.current[song.src] = preloadAudio; // 保存到缓存中
            }
        });

        return () => {
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('durationchange', updateDuration);
            audio.removeEventListener('canplay', updateDuration);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [currentIndex, currentSong.src]);

    // 关闭播放器（移动端暂停并收缩到侧边，桌面端暂停并隐藏）
    const handleClose = useCallback(() => {
        const audio = audioRef.current;
        // 暂停音乐
        if (audio && !audio.paused) {
            audio.pause();
        }

        if (isMobile) {
            // 移动端：收缩到侧边
            setIsExpanded(false);
            setIsDocked(true);
        } else {
            // 桌面端：完全隐藏
            setIsVisible(false);
        }
    }, [isMobile]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <>
            {/* audio 元素始终保持挂载 */}
            <audio ref={audioRef} preload="auto" />

            {/* 隐藏时只显示小按钮 */}
            {/* 隐藏时只显示小按钮 */}
            {!isVisible && (
                <motion.button
                    initial={{ scale: 0, opacity: 0, x: 0 }}
                    animate={{
                        scale: isDocked ? 0.7 : 1,
                        opacity: isDocked ? 0.4 : 1,
                        x: isDocked ? 20 : 0
                    }}
                    whileHover={{ opacity: 1, scale: 1.1, x: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setIsVisible(true);
                        setIsDocked(false); // 展开时取消收缩
                    }}
                    className="fixed bottom-24 right-2 md:right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-lg hover:border-[var(--color-accent)] transition-colors"
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
                                        const audio = audioRef.current;
                                        const rect = progressRef.current?.getBoundingClientRect();
                                        const audioDuration = audio?.duration;

                                        if (!rect || !audio || !Number.isFinite(audioDuration) || audioDuration <= 0) {
                                            return;
                                        }

                                        isDraggingRef.current = true;
                                        const wasPlaying = !audio.paused;
                                        wasPlayingRef.current = wasPlaying;

                                        if (wasPlaying) {
                                            audio.pause();
                                        }

                                        // 计算目标时间
                                        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                        const newTime = percent * audioDuration;
                                        setCurrentTime(newTime);

                                        // 检查 seekable 范围是否支持目标时间
                                        const seekable = audio.seekable;
                                        let canSeekNormally = false;
                                        for (let i = 0; i < seekable.length; i++) {
                                            if (newTime >= seekable.start(i) && newTime <= seekable.end(i)) {
                                                canSeekNormally = true;
                                                break;
                                            }
                                        }

                                        if (canSeekNormally) {
                                            // 正常 seek
                                            audio.currentTime = newTime;
                                        } else {
                                            // 服务器不支持 Range 请求，使用 Media Fragments 方式
                                            console.log('[MusicPlayer] Using Media Fragments for seek (server does not support Range requests)');
                                            const baseSrc = currentSong.src.split('#')[0];
                                            audio.src = `${baseSrc}#t=${newTime.toFixed(2)}`;
                                            audio.load();

                                            // 监听 canplay 事件，确认加载完成后恢复播放
                                            const onCanPlay = () => {
                                                audio.removeEventListener('canplay', onCanPlay);
                                                // 恢复播放（如果之前在播放）
                                                if (wasPlayingRef.current && !isDraggingRef.current) {
                                                    audio.play().catch(console.error);
                                                    wasPlayingRef.current = false;
                                                }
                                            };
                                            audio.addEventListener('canplay', onCanPlay);

                                            // 超时保护
                                            setTimeout(() => {
                                                audio.removeEventListener('canplay', onCanPlay);
                                            }, 3000);
                                        }

                                        if (duration !== audioDuration) {
                                            setDuration(audioDuration);
                                        }
                                    }}
                                    onTouchStart={(e) => {
                                        e.preventDefault();
                                        const touch = e.touches[0];
                                        const audio = audioRef.current;
                                        const rect = progressRef.current?.getBoundingClientRect();

                                        if (!rect || !audio) return;

                                        // 先设置拖动状态，即使 duration 无效也要设置
                                        isDraggingRef.current = true;
                                        wasPlayingRef.current = !audio.paused;

                                        if (wasPlayingRef.current) {
                                            audio.pause();
                                        }

                                        // 获取有效的 duration
                                        let validDuration = audio.duration;
                                        if (!Number.isFinite(validDuration) || validDuration <= 0) {
                                            validDuration = duration;
                                        }

                                        // 只有 duration 有效时才更新 UI
                                        if (Number.isFinite(validDuration) && validDuration > 0) {
                                            const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                                            const newTime = percent * validDuration;
                                            targetTimeRef.current = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    onTouchMove={(e) => {
                                        if (!isDraggingRef.current) return;

                                        const touch = e.touches[0];
                                        const audio = audioRef.current;
                                        const rect = progressRef.current?.getBoundingClientRect();

                                        let validDuration = audio?.duration;
                                        if (!Number.isFinite(validDuration) || validDuration <= 0) {
                                            validDuration = duration;
                                        }

                                        if (rect && audio && Number.isFinite(validDuration) && validDuration > 0) {
                                            const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                                            const newTime = percent * validDuration;
                                            targetTimeRef.current = newTime;
                                            setCurrentTime(newTime);
                                        }
                                    }}
                                    onTouchEnd={() => {
                                        if (!isDraggingRef.current) return;

                                        const audio = audioRef.current;
                                        const shouldResume = wasPlayingRef.current;
                                        const targetTime = targetTimeRef.current;

                                        if (!audio) {
                                            isDraggingRef.current = false;
                                            wasPlayingRef.current = false;
                                            return;
                                        }

                                        // 获取有效的 duration（优先 audio，其次 state）
                                        let currDuration = audio.duration;
                                        const hasValidAudioDuration = Number.isFinite(currDuration) && currDuration > 0;
                                        if (!hasValidAudioDuration) {
                                            currDuration = duration;
                                        }

                                        // 只要有算出来的 duration 和 targetTime，就尝试跳转
                                        if (Number.isFinite(currDuration) && currDuration > 0 && Number.isFinite(targetTime)) {

                                            // 1. 尝试直接设置
                                            audio.currentTime = targetTime;

                                            // 2. 检查是否需要 Media Fragments 强力跳转
                                            const seekFailed = !hasValidAudioDuration || (Math.abs(audio.currentTime - targetTime) > 1);

                                            if (seekFailed) {
                                                // 使用 Media Fragments，注意：此处保持 isDraggingRef = true
                                                // 防止 timeupdate 也就是 0 把 UI 刷回去
                                                const baseSrc = currentSong.src.split('#')[0];
                                                audio.src = `${baseSrc}#t=${targetTime.toFixed(2)}`;
                                                audio.load();

                                                // 监听 canplay 来确认加载完成
                                                const onCanPlay = () => {
                                                    audio.removeEventListener('canplay', onCanPlay);

                                                    // 只有加载完成了才允许 UI 更新
                                                    isDraggingRef.current = false;
                                                    wasPlayingRef.current = false;

                                                    if (shouldResume) {
                                                        audio.play().catch(console.error);
                                                    }
                                                };
                                                audio.addEventListener('canplay', onCanPlay);

                                                // 超时保护，防止卡死
                                                setTimeout(() => {
                                                    audio.removeEventListener('canplay', onCanPlay);
                                                    if (isDraggingRef.current) {
                                                        isDraggingRef.current = false;
                                                        wasPlayingRef.current = false;
                                                    }
                                                }, 2000);

                                                return; // 提前返回，不由下方逻辑重置 ref
                                            } else {
                                                // Seek 成功
                                                if (shouldResume) {
                                                    audio.play().catch(console.error);
                                                }
                                            }

                                        } else {
                                            // 没法计算时间，恢复 UI
                                            setTimeout(() => {
                                                setCurrentTime(audio.currentTime);
                                            }, 0);

                                            if (shouldResume) {
                                                audio.play().catch(console.error);
                                            }
                                        }

                                        // 正常路径（非 Media Fragment）重置状态
                                        isDraggingRef.current = false;
                                        wasPlayingRef.current = false;
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
                </AnimatePresence >
            )
            }
        </>
    );
}
