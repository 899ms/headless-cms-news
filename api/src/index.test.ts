import { describe, it, expect, beforeEach, vi } from 'vitest';
import app from './index';

const mockDB = {
  prepare: vi.fn().mockReturnValue({
    bind: vi.fn().mockReturnValue({
      all: vi.fn().mockResolvedValue({ results: [] }),
      run: vi.fn().mockResolvedValue({ meta: { last_row_id: 1 } }),
    }),
  }),
};

describe('API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return welcome message on root endpoint', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('欢迎使用新闻网站 API');
    expect(data.version).toBe('1.0.0');
  });

  it('should return health status on /health endpoint', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
  });

  it('should return articles list on /articles endpoint', async () => {
    mockDB.prepare().bind().all.mockResolvedValueOnce({
      results: [
        { id: 1, title: '测试文章', slug: 'test-article' },
      ],
    });

    const res = await app.request('/articles', {
      env: { DB: mockDB as any },
    });
    expect(res.status).toBe(200);
  });

  it('should create an article on POST /articles', async () => {
    const newArticle = {
      title: '新文章',
      slug: 'new-article',
      content: '文章内容',
    };

    const res = await app.request('/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
      env: { DB: mockDB as any },
    });
    expect(res.status).toBe(201);
  });
});
