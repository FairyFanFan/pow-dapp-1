# CI/CD 策略与实施指南

## 总览
- 平台: GitHub Actions + Vercel（CI 负责质量校验与构建，CD 由 Vercel 完成）
- 触发: Push/PR 到 main 分支
- 步骤: checkout → Node 20 → npm ci → lint → typecheck → build → 上传产物

## 为什么需要 CI/CD
- 保证代码质量与可用性（lint + typecheck + build）
- 每次提交都可验证可构建与可部署
- 与 Vercel 自动部署配合，保证线上稳定

## 配置说明
- `.github/workflows/ci.yml` 已创建
- `package.json` 已新增 `typecheck` 脚本
- 产物 `.next` 会被作为构建产物上传（7天保留）

## 与 Vercel 的关系
- CI 负责质量门禁，不直接部署
- 合并到 main 后，Vercel 自动拉取最新代码执行生产构建与部署
- 如需 Preview 部署，可在 PR 中让 Vercel 连接 GitHub 自动生成 Preview URL

## 后续可扩展
- 添加 Jest/Playwright 测试步骤
- 引入 Husky + lint-staged 做本地预提交校验
- 使用 `pnpm`/`yarn` 并在 CI 中开启对应缓存
- 引入 `semantic-release` 做自动版本与变更日志
- 设置 required checks，阻止不通过的 PR 合入

