# next-resume 项目级 AGENTS.md

本文件是本仓库的项目级规则。全局规则仍然生效；如果冲突，以本文件中更贴近本项目的规则为准。

## 项目定位

- 这是一个简历项目的 Next.js 初始框架，不是营销落地页模板。
- 默认目标是构建可读、专业、移动端友好、打印/PDF 友好的个人简历体验。
- UI 改动优先服务简历内容呈现：信息层级、扫描效率、可访问性、打印样式和响应式布局，比装饰性效果更重要。

## 技术栈事实

- 包管理器：`pnpm`。不要混用 `npm`、`yarn` 或 `bun` 写入锁文件。
- 框架：Next.js `16.2.5`，App Router，Turbopack。
- React：`19.2.4`。
- TypeScript：严格模式，路径别名 `@/*` 指向仓库根目录。
- 样式：Tailwind CSS v4，通过 `app/globals.css` 和 `@tailwindcss/postcss` 使用。
- UI 组件：已安装并配置 shadcn/ui，配置文件为 `components.json`，组件别名为 `@/components/ui`。
- 数据库客户端：`@neondatabase/serverless` `^1.1.0`。
- 主要源码入口：`app/layout.tsx`、`app/page.tsx`、`app/globals.css`。

## Next.js 16 硬约束

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

- 写 Next.js 相关代码前，先查本地文档：`node_modules/next/dist/docs/`。
- 默认使用 App Router 和 Server Components。只有确实需要浏览器状态、事件、DOM API 或客户端 Hook 时才添加 `'use client'`。
- Server Action 必须是 `async`，在函数体顶部写 `'use server'`，并把它当作可被直接 POST 调用的服务端入口处理。
- 不要按旧版 Next.js 经验猜 API、缓存、路由、表单或 Server Action 行为。

## Neon / 数据库规则

- 不要在模块顶层初始化数据库客户端、Redis、邮件 SDK 或其它依赖运行时环境变量的服务端客户端。
- 在 Next.js 构建和静态分析场景中，模块可能被提前求值；客户端应放在 Server Action、Route Handler 或懒加载 getter 内。
- `@neondatabase/serverless@1.1.0` 中，`neon()` 返回的 `sql`：
  - 标签模板写法：`sql\`SELECT ${value}\``。
  - 传统 `$1` 占位符写法：`sql.query('SELECT $1', [value])`。
  - 不要再写 `sql('SELECT $1', [value])`。
- 从 `FormData` 读取值后必须做类型校验和必要的空值处理，不要直接把 `FormDataEntryValue | null` 传入 SQL。
- `.env*` 文件包含敏感信息，不要读取、打印、提交或在回复中复述。当前项目需要 `DATABASE_URL` 才能真实写入 Neon。

## 简历 UI / 内容规则

- 前端 UI 优先使用已安装的 shadcn/ui 组件；常见控件、表单、弹窗、卡片、徽标、分隔线、按钮和输入框优先从 `@/components/ui` 组合，不要重复手写基础组件。
- 第一屏应直接呈现简历核心信息，不要做纯介绍型 landing page。
- 优先使用语义化结构：`main`、`section`、`header`、列表、标题层级和可访问表单控件。
- 内容建议结构化：个人信息、简介、技能、经历、项目、教育、链接。数据量增长后优先抽成 typed data，而不是把所有内容散落在 JSX 里。
- 响应式布局必须覆盖手机和桌面；文字不能重叠、溢出或依赖负字距。
- 简历页面应考虑打印体验：避免重要信息只存在于 hover、动画或客户端状态里。
- 如果引入视觉资产，优先使用真实头像、项目截图或品牌图标；没有素材时保持克制，不用无意义装饰图。

## 样式规则

- Tailwind v4 没有传统 `tailwind.config` 也可以工作；主题 token 主要在 `app/globals.css` 维护。
- 修改字体、颜色和全局变量时，先检查 `app/layout.tsx` 与 `app/globals.css` 的配合。
- 当前使用 `next/font/google` 的 Geist 字体；`next build` 在受限网络中可能因拉取 Google Fonts 失败。验证时要区分字体网络失败和代码失败。
- 使用 shadcn/ui 时遵循 `components.json`：RSC 开启、TSX 开启、样式入口为 `app/globals.css`、图标库为 `lucide`。
- 添加新 shadcn 组件时优先使用 CLI 或已有组件源码，保持组件落在 `components/ui/`，业务组合组件再放到 `components/`。
- 注意 Tailwind v4 的 `@theme inline` 解析时机，避免循环引用字体变量。
- 不要把页面 section 做成一层层嵌套卡片。卡片只用于重复条目、工具面板或明确需要边界的内容块。

## 命令

- 安装依赖：`pnpm install`
- 开发：`pnpm dev`
- 代码检查：`pnpm lint`
- 生产构建：`pnpm build`
- 启动生产产物：`pnpm start`

在 Codex 环境中，如果 `rtk` 可用，Shell 命令优先加 `rtk` 前缀，例如 `rtk pnpm lint`。

## 验证要求

- 改 TypeScript、React、Next.js、样式或配置后，至少运行 `pnpm lint`。
- 改 Server Action、路由、构建配置或依赖后，尽量运行 `pnpm build`。
- UI 改动需要用浏览器或截图验证移动端和桌面端，不只看编译结果。
- 如果验证失败，必须说明失败命令、关键错误、已排除内容和下一步。

## 文件与变更边界

- 不要删除或重建项目。不要重新运行 `create-next-app` 覆盖现有文件。
- 不要回滚用户已有改动。遇到陌生改动先调查，再决定如何兼容。
- `.agents/skills/` 是项目本地技能目录；除非任务明确要求，不要修改、删除或整理其中内容。
- `public/` 放静态资源。替换资源前确认调用点和文件名。
- 依赖升级、引入新库、修改 CI/CD、推送远程或公开发布都需要先确认。

## 文档维护

- 新增环境变量、脚本、部署步骤或主要功能时，同步更新 `README.md` 或本文件。
- 结论必须来自项目文件、官方文档、运行结果或明确标注为推断；不要编造路径、API、版本或测试结果。
