import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

interface Article {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  author?: string;
  cover_image?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => {
  return c.json({
    message: '欢迎使用新闻网站 API',
    version: '1.0.0',
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.get('/articles', async (c) => {
  const { DB } = c.env;
  const { limit = 10, offset = 0, category } = c.req.query();

  let query = 'SELECT * FROM articles';
  const params: any[] = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  const { results } = await DB.prepare(query).bind(...params).all();
  return c.json(results);
});

app.get('/articles/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const { results } = await DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).all();

  if (!results || results.length === 0) {
    return c.json({ error: '文章不存在' }, 404);
  }

  return c.json(results[0]);
});

app.get('/articles/slug/:slug', async (c) => {
  const { DB } = c.env;
  const slug = c.req.param('slug');
  const { results } = await DB.prepare('SELECT * FROM articles WHERE slug = ?').bind(slug).all();

  if (!results || results.length === 0) {
    return c.json({ error: '文章不存在' }, 404);
  }

  return c.json(results[0]);
});

app.post('/articles', async (c) => {
  const { DB } = c.env;
  const article: Article = await c.req.json();
  const now = new Date().toISOString();

  const result = await DB.prepare(
    'INSERT INTO articles (title, slug, content, excerpt, category, author, cover_image, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(
      article.title,
      article.slug,
      article.content,
      article.excerpt || '',
      article.category || '',
      article.author || '',
      article.cover_image || '',
      article.published_at || now,
      now,
      now
    )
    .run();

  return c.json({ id: result.meta.last_row_id, ...article }, 201);
});

app.put('/articles/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  const article: Partial<Article> = await c.req.json();
  const now = new Date().toISOString();

  const updates: string[] = [];
  const params: any[] = [];

  if (article.title) { updates.push('title = ?'); params.push(article.title); }
  if (article.slug) { updates.push('slug = ?'); params.push(article.slug); }
  if (article.content) { updates.push('content = ?'); params.push(article.content); }
  if (article.excerpt !== undefined) { updates.push('excerpt = ?'); params.push(article.excerpt); }
  if (article.category !== undefined) { updates.push('category = ?'); params.push(article.category); }
  if (article.author !== undefined) { updates.push('author = ?'); params.push(article.author); }
  if (article.cover_image !== undefined) { updates.push('cover_image = ?'); params.push(article.cover_image); }
  if (article.published_at) { updates.push('published_at = ?'); params.push(article.published_at); }

  updates.push('updated_at = ?');
  params.push(now);
  params.push(id);

  await DB.prepare(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

  const { results } = await DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).all();
  return c.json(results[0]);
});

app.delete('/articles/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  await DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

app.get('/categories', async (c) => {
  const { DB } = c.env;
  const { results } = await DB.prepare('SELECT * FROM categories').all();
  return c.json(results);
});

export default app;
