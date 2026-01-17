import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ScrollReveal from '../components/ui/ScrollReveal';
import { getPost } from '../api/posts';

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFloatButtons, setShowFloatButtons] = useState(false);

  // 监听滚动，控制悬浮按钮显示
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatButtons(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 返回博客列表
  const goBack = () => {
    navigate('/blog');
  };

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPost(id);
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  if (loading) {
    return <div className="pb-24" style={{ paddingTop: '50px' }} />;
  }

  if (error) {
    return (
      <div className="pb-24 text-center" style={{ paddingTop: '120px' }}>
        <div className="container-custom">
          <h1 className="font-heading text-4xl mb-4 text-red-400">加载失败</h1>
          <p className="text-[var(--color-muted)] mb-4">{error}</p>
          <Link to="/blog" className="text-[var(--color-accent)] link-underline">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pb-24 text-center" style={{ paddingTop: '120px' }}>
        <div className="container-custom">
          <h1 className="font-heading text-4xl mb-4">文章不存在</h1>
          <Link to="/blog" className="text-[var(--color-accent)] link-underline">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  // 检测内容是否为 HTML（以 < 开头）
  const isHtml = article.content.trim().startsWith('<');

  return (
    <article className="pb-24" style={{ paddingTop: '50px' }}>
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* 文章头部 */}
          <header className="mb-12">
            <ScrollReveal delay={0}>
              <div className="flex items-start gap-4 mb-6">
                <Link
                  to="/blog"
                  className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all flex-shrink-0"
                  style={{ marginTop: '20px' }} aria-label="返回博客"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transform transition-transform group-hover:-translate-x-0.5"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl flex-1 leading-tight">
                  {article.title}
                </h1>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <div className="flex items-center gap-4 text-sm text-[var(--color-muted)] pl-12 md:pl-14">
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="w-full h-px bg-[var(--color-border)] mt-8" />
            </ScrollReveal>
          </header>

          {/* 文章内容 */}
          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {isHtml ? (
              // 兼容旧的 HTML 格式
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              // 新的 Markdown 格式
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            )}
          </motion.div>

          {/* 文章底部 */}
          <motion.footer
            className="mt-16 pt-8 border-t border-[var(--color-border)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-sm text-[var(--color-muted)] text-center">
              感谢阅读，如有任何想法欢迎交流
            </p>
          </motion.footer>
        </div>
      </div>

      {/* 文章内容样式 */}
      <style>{`
        .prose h1 {
          font-family: var(--font-heading);
          font-size: 2rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-primary);
        }
        
        .prose h2 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-primary);
        }
        
        .prose h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: var(--color-primary);
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
          color: var(--color-secondary);
        }
        
        .prose ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
          color: var(--color-secondary);
          list-style-type: disc;
        }
        
        .prose ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
          color: var(--color-secondary);
          list-style-type: decimal;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        
        .prose code {
          background: var(--color-surface);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          color: var(--color-accent);
        }
        
        .prose pre {
          background: var(--color-surface);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        
        .prose pre code {
          background: transparent;
          padding: 0;
        }
        
        .prose blockquote {
          border-left: 3px solid var(--color-accent);
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: var(--color-muted);
          font-style: italic;
        }
        
        .prose a {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .prose a:hover {
          color: var(--color-accent-light);
        }
        
        .prose img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .prose th, .prose td {
          border: 1px solid var(--color-border);
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose th {
          background: var(--color-surface);
          font-weight: 600;
        }
        
        .prose h4 {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
          color: var(--color-primary);
        }
        
        .prose h5 {
          font-family: var(--font-heading);
          font-size: 1rem;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-primary);
        }
        
        .prose h6 {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--color-muted);
        }
        
        .prose strong {
          font-weight: 600;
          color: var(--color-primary);
        }
        
        .prose em {
          font-style: italic;
          color: var(--color-muted);
        }
        
        .prose hr {
          border: none;
          border-top: 1px solid var(--color-border);
          margin: 2rem 0;
        }
        
        .prose ul ul, .prose ol ol, .prose ul ol, .prose ol ul {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .prose ul ul {
          list-style-type: circle;
        }
        
        .prose ul ul ul {
          list-style-type: square;
        }

        /* 悬浮按钮样式 */
        .float-buttons {
          position: fixed;
          left: 24px;
          bottom: 100px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 100;
        }

        .float-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .float-btn:hover {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .float-btn:active {
          transform: translateY(0);
        }

        /* 移动端隐藏 */
        @media (max-width: 768px) {
          .float-buttons {
            display: none;
          }
        }
      `}</style>

      {/* 悬浮按钮组 */}
      <AnimatePresence>
        {showFloatButtons && (
          <motion.div
            className="float-buttons"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 返回按钮 */}
            <motion.button
              className="float-btn"
              onClick={goBack}
              aria-label="返回"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="返回博客"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* 回到顶部按钮 */}
            <motion.button
              className="float-btn"
              onClick={scrollToTop}
              aria-label="回到顶部"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="回到顶部"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
