# 部署指南

本指南将帮助你使用 GitHub CLI 和 Cloudflare CLI 完成完整的 CI/CD 部署。

## 前提条件

确保已安装以下工具：
- GitHub CLI (`gh`)
- Cloudflare Wrangler (`wrangler`)
- Node.js 20+

## 快速开始

### 1. 登录 GitHub CLI
```bash
gh auth login
```

### 2. 登录 Cloudflare Wrangler
```bash
wrangler login
```

## 部署步骤

### 第一阶段：Cloudflare 基础设施

#### 1.1 创建 D1 数据库
```bash
cd api
wrangler d1 create news-site-db
```

**重要**：记录返回的 `database_id`，更新 `wrangler.toml`：
```toml
[[d1_databases]]
binding = "DB"
database_name = "news-site-db"
database_id = "你的-database-id"
```

#### 1.2 创建 Pages 项目
```bash
# 前端项目
wrangler pages project create news-site-web --production-branch main

# 管理后台项目
wrangler pages project create news-site-admin --production-branch main
```

#### 1.3 创建 API Token
在 Cloudflare Dashboard 创建 API Token，权限要求：
- Workers Scripts: Edit
- D1: Edit
- Pages: Edit
- Access: Edit (可选)

#### 1.4 获取 Account ID
```bash
wrangler whoami
```
记录 Account ID。

### 第二阶段：GitHub 配置

#### 2.1 创建 GitHub 仓库
```bash
gh repo create headless-cms-news --public --source=. --remote=origin --push
```

#### 2.2 配置 GitHub Secrets
```bash
gh secret set CLOUDFLARE_API_TOKEN --body "你的-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "你的-account-id"
```

### 第三阶段：验证部署

#### 3.1 推送代码
```bash
git add .
git commit -m "Setup CI/CD"
git push -u origin main
```

#### 3.2 检查 Actions
访问 GitHub 仓库的 Actions 标签页，查看部署状态。

## 工作流说明

### 1. deploy.yml
- 触发：推送到 main 分支或 PR 到 main
- 功能：
  - 运行所有测试（web、api、admin）
  - 部署 web 到 Cloudflare Pages
  - 部署 api 到 Cloudflare Workers
  - 部署 admin 到 Cloudflare Pages

### 2. pr-check.yml
- 触发：PR 到 main
- 功能：
  - 运行测试和覆盖率
  - 代码质量检查
  - 构建测试

### 3. migrate.yml
- 触发：手动触发
- 功能：
  - 数据库迁移
  - 可选备份

## 手动部署（可选）

### 部署 API
```bash
cd api
npm run deploy
```

### 部署 Web
```bash
cd web
npm run build
wrangler pages deploy dist --project-name=news-site-web
```

### 部署 Admin
```bash
cd admin
npm run build
wrangler pages deploy dist --project-name=news-site-admin
```

## 故障排除

### 问题：部署失败
检查：
1. GitHub Secrets 是否已正确设置
2. Cloudflare API Token 权限是否足够
3. 查看 GitHub Actions 日志

### 问题：数据库连接失败
检查：
1. D1 database_id 是否正确
2. wrangler.toml 配置是否正确
3. 数据库是否已创建

## 后续步骤

部署成功后：
1. 访问生成的 Pages URL 验证前端
2. 测试 API 端点
3. 配置自定义域名（可选）
4. 设置监控和告警
