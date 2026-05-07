# next-resume

Next.js 全栈个人简历应用。项目以 App Router 为入口，使用 Neon/PostgreSQL 存储简历内容和联系消息。

## Getting Started

启动开发服务：

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看页面。

## Database

建表脚本位于 `database/neon-schema.sql`。本地和部署环境需要提供服务端环境变量：

```bash
DATABASE_URL=...
```

不要提交 `.env*` 文件或在日志中输出连接串。

## Interfaces

当前已实现的服务端接口：

| 路径 | 方法 | 用途 |
|---|---:|---|
| `/api/health` | `GET` | 数据库健康检查 |
| `/api/resume?slug=<resume-slug>` | `GET` | 获取已发布简历聚合数据；不传 `slug` 时返回最新已发布简历 |
| `/api/projects?resumeSlug=<resume-slug>` | `GET` | 获取已发布简历下的可见项目列表 |
| `/api/projects/[slug]?resumeSlug=<resume-slug>` | `GET` | 获取单个可见项目详情 |
| `/api/contact` | `POST` | 写入联系消息到 `contact_messages` |

联系消息 `POST /api/contact` 支持字段：

```json
{
  "senderName": "姓名",
  "senderEmail": "name@example.com",
  "senderCompany": "公司或来源，可选",
  "subject": "主题，可选",
  "message": "消息内容",
  "resumeSlug": "简历 slug，可选"
}
```

页面内部表单可复用 `app/actions/contact.ts` 中的 `submitContactMessage` Server Action。

## Scripts

```bash
pnpm lint
pnpm build
pnpm start
```

## Notes

实现约束见 `AGENTS.md` 和 `docs/PRD.md`。数据库客户端通过懒加载 getter 创建，避免在构建或静态分析阶段读取运行时环境变量。
