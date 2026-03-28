# CI/CD 部署完整计划

## 目标
使用 GitHub CLI 和 Cloudflare CLI 为 headless-cms-news 项目配置完整的 CI/CD 流水线。

## 前提条件检查清单
- [ ] GitHub CLI (gh) 已安装并登录
- [ ] Cloudflare CLI (wrangler) 已安装并登录
- [ ] GitHub 账户可用
- [ ] Cloudflare 账户可用

---

## 第一阶段：Cloudflare 基础设施配置

### 1.1 创建 Cloudflare D1 数据库
```bash
# 创建 D1 数据库
wrangler d1 create news-site-db

# 记录返回的 database_id，更新 wrangler.toml
```

### 1.2 创建 Cloudflare R2 存储桶（可选，用于媒体文件）
```bash
# 创建 R2 存储桶
wrangler r2 bucket create news-site-media
```

### 1.3 创建 Cloudflare Pages 项目
```bash
# 创建前端 Pages 项目
wrangler pages project create news-site-web --production-branch main

# 创建管理后台 Pages 项目
wrangler pages project create news-site-admin --production-branch main
```

### 1.4 获取 Cloudflare 凭据
```bash
# 获取 Account ID
wrangler whoami

# 创建 API Token（需要手动在 Cloudflare Dashboard 完成）
# 权限要求：
# - Workers Scripts: Edit
# - D1: Edit
# - Pages: Edit
# - Access: Edit (如需要)
```

---

## 第二阶段：GitHub 仓库配置

### 2.1 创建 GitHub 仓库
```bash
# 使用 GitHub CLI 创建仓库
gh repo create headless-cms-news --public --source=. --remote=origin --push
```

### 2.2 配置 GitHub Secrets
```bash
# 设置 Cloudflare 凭据
gh secret set CLOUDFLARE_API_TOKEN --body "your-api-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"
```

### 2.3 推送初始代码
```bash
# 已在之前完成
# git add .
# git commit -m "Initial commit"
# git push -u origin main
```

---

## 第三阶段：CI/CD 工作流增强

### 3.1 更新 GitHub Actions 工作流
现有工作流位置：`.github/workflows/deploy.yml`

**增强内容：**
- 添加环境变量管理
- 添加数据库迁移步骤
- 添加端到端测试
- 添加部署前检查

### 3.2 创建数据库迁移工作流
新建文件：`.github/workflows/migrate.yml`
- 手动触发的数据库迁移
- 包含回滚机制
- 迁移前备份

### 3.3 创建 PR 检查工作流
新建文件：`.github/workflows/pr-check.yml`
- PR 自动测试
- 代码质量检查
- 预览环境部署

---

## 第四阶段：部署验证

### 4.1 验证后端部署
```bash
# 检查 Workers 部署状态
wrangler deploy --dry-run

# 手动部署测试
cd api
npm run deploy
```

### 4.2 验证前端部署
```bash
# 检查 Pages 项目
wrangler pages project list

# 手动构建测试
cd web
npm run build
```

### 4.3 集成测试
- API 端点测试
- 前端页面加载测试
- 管理后台功能测试

---

## 第五阶段：监控和日志

### 5.1 配置 Cloudflare 日志
```bash
# 启用 Workers 日志
wrangler tail news-site-api
```

### 5.2 设置 GitHub Actions 通知
- 部署成功/失败通知
- 测试覆盖率报告

---

## 部署顺序

1. **Cloudflare 基础设施** → 2. **GitHub 仓库** → 3. **工作流配置** → 4. **验证测试** → 5. **监控设置**

## 预期成果

- ✅ 代码推送到 main 分支自动触发部署
- ✅ PR 自动运行测试和检查
- ✅ 90%+ 测试覆盖率
- ✅ 数据库迁移自动化
- ✅ 完整的部署日志和监控
