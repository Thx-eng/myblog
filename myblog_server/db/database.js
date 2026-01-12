import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建/连接数据库
const db = new Database(join(__dirname, 'blog.db'));

// 初始化表结构
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT '随想',
    readTime TEXT DEFAULT '5 分钟',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 检查是否需要插入示例数据
const count = db.prepare('SELECT COUNT(*) as count FROM posts').get();
if (count.count === 0) {
    const insertStmt = db.prepare(`
    INSERT INTO posts (title, excerpt, content, category, readTime, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    // 插入示例文章
    insertStmt.run(
        '探索现代前端开发的艺术',
        '从设计系统到组件架构，让我们深入了解如何打造优雅的用户界面。',
        `<p>前端开发已经从简单的网页制作演变成一门综合性的艺术。在这篇文章中，我们将探索现代前端开发的各个方面，从设计系统到组件架构，从性能优化到用户体验。</p>
    
<h2>设计系统的重要性</h2>
<p>一个好的设计系统是构建一致性用户界面的基础。它不仅仅是颜色和字体的集合，更是一套完整的设计语言和开发规范。通过建立统一的设计令牌（Design Tokens），我们可以确保整个应用在视觉和交互上的一致性。</p>

<h2>组件化思维</h2>
<p>现代前端框架如 React、Vue 都推崇组件化开发。将界面拆分成独立、可复用的组件，不仅提高了代码的可维护性，也让团队协作变得更加高效。每个组件都应该有明确的职责，遵循单一职责原则。</p>

<h2>性能优化策略</h2>
<p>性能是用户体验的关键因素。通过代码分割、懒加载、缓存策略等技术手段，我们可以显著提升应用的加载速度和运行效率。同时，我们也需要关注运行时性能，避免不必要的重渲染。</p>

<h2>结语</h2>
<p>前端开发是技术与艺术的结合。作为开发者，我们不仅要掌握技术，更要培养对美的感知和对用户体验的关注。只有这样，才能创造出真正优秀的产品。</p>`,
        '前端开发',
        '8 分钟',
        '2026-01-10'
    );

    insertStmt.run(
        '简约设计的哲学思考',
        '少即是多。探讨如何在设计中保持克制，创造更有力量的作品。',
        `<p>"少即是多"——这句话已经成为设计界的经典格言。但真正理解并实践简约设计，需要我们深入思考其背后的哲学。</p>

<h2>简约不等于简单</h2>
<p>简约设计并不意味着减少功能或降低品质。相反，它要求我们在保留核心价值的同时，去除一切不必要的元素。这需要深刻理解用户需求，并做出正确的取舍决策。</p>

<h2>留白的力量</h2>
<p>在设计中，留白不是空虚，而是一种有意识的设计选择。适当的留白可以引导用户的视觉焦点，创造呼吸的空间，让整体设计更加优雅。</p>

<h2>克制的美学</h2>
<p>简约设计需要克制的心态。当我们手握各种设计工具和效果时，最难的往往是"不用"。每一个设计决策都应该问自己：这真的必要吗？</p>

<h2>结语</h2>
<p>简约设计是一种哲学，需要长期的实践和思考。它教会我们专注于本质，追求更高层次的美。</p>`,
        '设计思考',
        '5 分钟',
        '2026-01-05'
    );

    insertStmt.run(
        '代码中的诗意',
        '编程不仅是逻辑的表达，更是一种创造性的艺术形式。',
        `<p>编程通常被认为是一项理性的活动，但我相信，在代码的世界里，同样存在着诗意和美。</p>

<h2>代码的节奏</h2>
<p>优美的代码有自己的节奏。缩进、空行、命名，这些看似细节的东西，实际上构成了代码的韵律。当你阅读一段写得好的代码时，会有一种流畅的阅读体验，就像阅读一首诗。</p>

<h2>抽象的艺术</h2>
<p>编程的核心是抽象。将复杂的现实问题转化为清晰的代码逻辑，这本身就是一种创造性的艺术。每一个优雅的抽象，都是对本质的深刻洞察。</p>

<h2>解决问题的快乐</h2>
<p>当你经过长时间的思考和调试，终于解决了一个棘手的问题时，那种成就感是难以言喻的。这种快乐，与艺术家完成作品时的满足感并无二致。</p>

<h2>结语</h2>
<p>让我们在追求代码效率的同时，也不忘欣赏它的美。毕竟，编程是我们与机器对话的方式，为什么不让这种对话更加诗意呢？</p>`,
        '随想',
        '6 分钟',
        '2025-12-28'
    );

    console.log('✅ 已插入示例文章数据');
}

export default db;
