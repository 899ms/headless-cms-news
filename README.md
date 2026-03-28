# Headless CMS 新闻网站

基于 Astro v6、Hono 和 Cloudflare 全栈构建的无头 CMS 新闻网站。

## 项目结构

```
headless-cms-news/
├── web/           # Astro v6 前端
├── api/           # Hono + Cloudflare Workers 后端API
├── admin/         # Refine 管理仪表盘
└── ui/            # Prototypr UI 组件库
```

## 技术栈

- **前端**: Astro v6 + Cloudflare Pages
- **后端**: Hono + Cloudflare Workers
- **数据库**: Cloudflare D1
- **管理后台**: Refine
- **存储**: Cloudflare R2

## 快速开始

### 安装依赖

```bash
npm run install:all
```

### 开发模式

```bash
# 启动前端
npm run dev:web

# 启动后端API
npm run dev:api

# 启动管理后台
npm run dev:admin
```

### 构建

```bash
# 构建前端
npm run build:web

# 部署后端API
npm run build:api

# 构建管理后台
npm run build:admin
```

## 测试

```bash
# 运行测试
cd web && npm test
cd api && npm test
cd admin && npm test

# 运行测试并生成覆盖率报告
cd web && npm run test:coverage
cd api && npm run test:coverage
cd admin && npm run test:coverage
```

## CI/CD

项目使用 GitHub Actions 自动部署到 Cloudflare。需要配置以下 GitHub Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## License

MIT
