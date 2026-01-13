/**
 * 骨架屏组件 - 用于内容加载时的占位显示
 */

// 基础骨架元素
export function Skeleton({ className = '', ...props }) {
    return (
        <div
            className={`skeleton ${className}`}
            {...props}
        />
    );
}

// 博客卡片骨架
export function BlogCardSkeleton() {
    return (
        <div className="relative h-full min-h-[120px] p-6 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] flex flex-col">
            {/* 分类标签骨架 */}
            <Skeleton className="h-3 w-16 rounded mb-4" />

            {/* 标题骨架 */}
            <Skeleton className="h-6 w-4/5 rounded mb-2" />
            <Skeleton className="h-6 w-3/5 rounded mb-3" />

            {/* 摘要骨架 */}
            <Skeleton className="h-4 w-full rounded mb-1" />
            <Skeleton className="h-4 w-4/5 rounded mb-6" />

            {/* 底部信息骨架 */}
            <div className="flex items-center justify-between mt-auto">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
            </div>
        </div>
    );
}

// 文章页面骨架
export function ArticleSkeleton() {
    return (
        <article className="pb-24" style={{ paddingTop: '50px' }}>
            <div className="container-custom">
                <div className="max-w-2xl mx-auto">
                    {/* 文章头部骨架 */}
                    <header className="mb-12">
                        <div className="flex items-start gap-4 mb-6">
                            {/* 返回按钮骨架 */}
                            <Skeleton
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0"
                                style={{ marginTop: '20px' }}
                            />
                            {/* 标题骨架 */}
                            <div className="flex-1">
                                <Skeleton className="h-10 md:h-12 w-3/4 rounded mb-2" />
                                <Skeleton className="h-10 md:h-12 w-1/2 rounded" />
                            </div>
                        </div>

                        {/* 日期和阅读时间骨架 */}
                        <div className="flex items-center gap-4 pl-12 md:pl-14">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>

                        {/* 分隔线骨架 */}
                        <Skeleton className="w-full h-px mt-8" />
                    </header>

                    {/* 文章内容骨架 */}
                    <div className="space-y-4">
                        <Skeleton className="h-5 w-full rounded" />
                        <Skeleton className="h-5 w-full rounded" />
                        <Skeleton className="h-5 w-4/5 rounded" />
                        <div className="h-4" />
                        <Skeleton className="h-5 w-full rounded" />
                        <Skeleton className="h-5 w-full rounded" />
                        <Skeleton className="h-5 w-3/4 rounded" />
                        <div className="h-4" />
                        <Skeleton className="h-5 w-full rounded" />
                        <Skeleton className="h-5 w-5/6 rounded" />
                    </div>
                </div>
            </div>
        </article>
    );
}

export default Skeleton;
