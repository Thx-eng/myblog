// 生产环境使用 Workers 地址，开发环境使用本地 Wrangler
const API_BASE = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || 'https://myblog-api.myblog-thx.workers.dev/api')
    : 'http://127.0.0.1:8787/api';  // Wrangler dev 绑定地址

// ===== 缓存配置 =====
const CACHE_PREFIX = 'blog_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 缓存有效期：5分钟

// 内存缓存（页面会话内立即可用）
const memoryCache = new Map();

// 从缓存获取数据
function getFromCache(key) {
    // 优先使用内存缓存
    if (memoryCache.has(key)) {
        return memoryCache.get(key);
    }
    // 回退到 localStorage
    try {
        const cached = localStorage.getItem(CACHE_PREFIX + key);
        if (cached) {
            const data = JSON.parse(cached);
            memoryCache.set(key, data); // 同步到内存缓存
            return data;
        }
    } catch (e) {
        // localStorage 不可用时忽略
    }
    return null;
}

// 保存数据到缓存
function saveToCache(key, data) {
    const cacheData = { data, timestamp: Date.now() };
    memoryCache.set(key, cacheData);
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (e) {
        // localStorage 满了或不可用时忽略
    }
}

// 检查缓存是否过期
function isCacheValid(cached) {
    if (!cached || !cached.timestamp) return false;
    return Date.now() - cached.timestamp < CACHE_TTL;
}

// 清除所有文章缓存（用于创建/更新/删除后）
function clearPostsCache() {
    // 清除内存缓存
    memoryCache.clear();
    // 清除 localStorage 缓存
    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
        // 忽略
    }
}

// 获取认证请求头
const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_password');
    return {
        'Content-Type': 'application/json',
        'X-Auth-Key': token || ''
    };
};

// 验证密码
export async function verifyPassword(password) {
    const response = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Key': password
        }
    });
    if (!response.ok) {
        throw new Error('密码错误');
    }
    return response.json();
}

// 获取所有文章（带缓存）
export async function getPosts(category = null) {
    const cacheKey = `posts_${category || 'all'}`;
    const cached = getFromCache(cacheKey);

    // 如果有缓存，先返回缓存数据
    if (cached && cached.data) {
        // 如果缓存未过期，直接返回
        if (isCacheValid(cached)) {
            return cached.data;
        }
        // 缓存过期但存在，后台刷新，先返回旧数据
        refreshPostsCache(category, cacheKey);
        return cached.data;
    }

    // 无缓存，正常请求
    return fetchAndCachePosts(category, cacheKey);
}

// 后台刷新文章列表缓存
async function refreshPostsCache(category, cacheKey) {
    try {
        await fetchAndCachePosts(category, cacheKey);
    } catch (e) {
        // 静默失败，用户仍可看到旧缓存
    }
}

// 请求并缓存文章列表
async function fetchAndCachePosts(category, cacheKey) {
    const url = category && category !== '全部'
        ? `${API_BASE}/posts?category=${encodeURIComponent(category)}`
        : `${API_BASE}/posts`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('获取文章列表失败');
    }
    const data = await response.json();
    saveToCache(cacheKey, data);
    return data;
}

// 获取单篇文章（带缓存）
export async function getPost(id) {
    const cacheKey = `post_${id}`;
    const cached = getFromCache(cacheKey);

    // 如果有缓存且未过期，直接返回
    if (cached && cached.data && isCacheValid(cached)) {
        return cached.data;
    }

    // 如果有过期缓存，后台刷新，先返回旧数据
    if (cached && cached.data) {
        refreshPostCache(id, cacheKey);
        return cached.data;
    }

    // 无缓存，正常请求
    return fetchAndCachePost(id, cacheKey);
}

// 后台刷新单篇文章缓存
async function refreshPostCache(id, cacheKey) {
    try {
        await fetchAndCachePost(id, cacheKey);
    } catch (e) {
        // 静默失败
    }
}

// 请求并缓存单篇文章
async function fetchAndCachePost(id, cacheKey) {
    const response = await fetch(`${API_BASE}/posts/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error('获取文章失败');
    }
    const data = await response.json();
    saveToCache(cacheKey, data);
    return data;
}

// 创建文章
export async function createPost(postData) {
    const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
    });
    if (!response.ok) {
        throw new Error('创建文章失败');
    }
    clearPostsCache(); // 清除缓存
    return response.json();
}

// 更新文章
export async function updatePost(id, postData) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
    });
    if (!response.ok) {
        throw new Error('更新文章失败');
    }
    clearPostsCache(); // 清除缓存
    return response.json();
}

// 删除文章
export async function deletePost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error('删除文章失败');
    }
    clearPostsCache(); // 清除缓存
    return response.json();
}
