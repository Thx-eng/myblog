const API_BASE = 'http://localhost:3001/api';

// 获取所有文章
export async function getPosts(category = null) {
    const url = category && category !== '全部'
        ? `${API_BASE}/posts?category=${encodeURIComponent(category)}`
        : `${API_BASE}/posts`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('获取文章列表失败');
    }
    return response.json();
}

// 获取单篇文章
export async function getPost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error('获取文章失败');
    }
    return response.json();
}

// 创建文章
export async function createPost(postData) {
    const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    if (!response.ok) {
        throw new Error('创建文章失败');
    }
    return response.json();
}

// 更新文章
export async function updatePost(id, postData) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    if (!response.ok) {
        throw new Error('更新文章失败');
    }
    return response.json();
}

// 删除文章
export async function deletePost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('删除文章失败');
    }
    return response.json();
}
