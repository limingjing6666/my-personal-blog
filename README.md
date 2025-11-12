# 🚀 我的个人博客 - Fuwari 增强版

这是一个基于 [Fuwari](https://github.com/saicaca/fuwari) 模板深度定制和功能增强的现代化个人博客系统。它不仅拥有 Fuwari 原生的优雅设计和高性能，还集成了一系列专业功能，使其成为一个功能完善、体验卓越的个人内容发布平台。

**版本: 3.1** (最后更新: 2025-11-10)

---

## ✨ 功能亮点

| 功能分类 | 特性 | 状态 |
| :--- | :--- | :--- |
| **核心功能** | ✍️ Markdown 文章 & 静态生成 (Astro) | ✅ |
| | 🌓 明暗主题切换 | ✅ |
| | 🔍 全文内容搜索 (Pagefind) | ✅ |
| | 📱 响应式设计 | ✅ |
| **国际化** | 🌐 **中/英文界面切换** | ✅ |
| | 📄 **多语言文章支持** | ✅ |
| **互动体验** | 💬 **Giscus 评论系统** (基于 GitHub Discussions) | ✅ |
| | 👍 **文章点赞/反应** (可集成) | 💡 建议 |
| **数据分析** | 📊 **Umami 真实访问统计** (隐私友好) | ✅ |
| | 📈 **文章阅读统计** (进度条、时长、浏览量) | ✅ |
| **SEO 优化** | 🔍 **完整的 SEO 增强** (Sitemap, Open Graph, JSON-LD) | ✅ |
| **社交分享** | 🔗 **一键社交分享** (Twitter, Facebook, LinkedIn, 微博) | ✅ |
| **性能优化** | ⚡ **高级性能优化** (图片懒加载, 代码分割) | ✅ |
| **内容管理** | 📚 **文章系列功能** (可集成) | 💡 建议 |
| | 📧 **Newsletter 订阅** (可集成) | 💡 建议 |

---

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build/) - 用于构建高性能、内容驱动的网站。
- **UI 库**: [Svelte](https://svelte.dev/) - 用于构建交互式组件。
- **样式**: [Tailwind CSS](https://tailwindcss.com/) - 一个功能优先的 CSS 框架。
- **搜索**: [Pagefind](https://pagefind.app/) - 静态网站的全文搜索库。
- **评论**: [Giscus](https://giscus.app/) - 基于 GitHub Discussions 的评论系统。
- **统计**: [Umami](https://umami.is/) - 开源、注重隐私的网站分析工具。
- **部署**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) / [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🚀 快速开始

### 1. 环境要求

- [Node.js](https://nodejs.org/en/) >= v18.0.0
- [pnpm](https://pnpm.io/) (推荐)

### 2. 克隆项目

```bash
git clone <your-repo-url>
cd my-personal-blog
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 本地开发

```bash
pnpm dev
```

打开浏览器访问 `http://localhost:4321`。

### 5. 构建项目

```bash
pnpm build
```

构建后的文件将输出到 `dist/` 目录。

---

## ⚙️ 配置指南

在部署前，请务必完成以下关键配置。

### 1. 基础配置

编辑 `src/config.ts` 文件，修改博客标题、描述、作者信息等。

### 2. 域名配置 (非常重要)

编辑 `astro.config.mjs`，将 `site` 属性修改为您的最终部署域名。这对 SEO 和 RSS 生成至关重要。

```javascript
// astro.config.mjs
export default defineConfig({
  site: "https://your-blog-domain.com/",
  // ...
});
```

### 3. Umami 统计配置 (高优先级)

1.  访问 [Umami Cloud](https://cloud.umami.is) 注册并获取 **Website ID**。
2.  在项目根目录创建 `.env` 文件。
3.  添加以下内容：

    ```env
    # .env
    PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

    > **注意**: 在 Vercel 等平台部署时，需要将此设置为环境变量。

### 4. Giscus 评论配置 (高优先级)

1.  确保您的 GitHub 仓库已启用 **Discussions** 功能。
2.  访问 [Giscus.app](https://giscus.app/) 并按照说明生成配置。
3.  编辑 `src/components/Comment.astro` 文件，填入您的配置信息：

    ```javascript
    // src/components/Comment.astro
    const giscusConfig = {
      repo: 'your-username/your-repo', // 替换为您的仓库
      repoId: 'R_xxxxx', // 从 giscus.app 获取
      category: 'Announcements',
      categoryId: 'DIC_xxxxx', // 从 giscus.app 获取
      // ...
    };
    ```

### 5. SEO 与社交分享图片

将您的主视觉图片命名为 `og-image.png` (推荐尺寸 1200x630) 并放入 `public/` 目录。这张图片将用于社交媒体分享时的预览图。

---

## 📁 目录结构

```
.gitignore
.env.example        # 环境变量示例
README.md           # 项目说明
astro.config.mjs    # Astro 配置文件
package.json
pnpm-lock.yaml
public/             # 静态资源 (图片, favicon)
src/
├── components/     # 可复用组件 (.astro, .svelte)
├── content/        # Markdown 内容 (博客文章)
├── constants/      # 全局常量
├── i18n/           # 国际化语言文件
├── layouts/        # 页面布局
├── pages/          # 页面路由
├── styles/         # 全局样式
├── types/          # TypeScript 类型定义
└── utils/          # 工具函数
tailwind.config.cjs # Tailwind CSS 配置
tsconfig.json       # TypeScript 配置
```

---

## 🚀 部署

本项目可以轻松部署到任何支持静态站点的平台。

### 推荐平台：Vercel

1.  将您的代码推送到 GitHub 仓库。
2.  登录 [Vercel](https://vercel.com/) 并选择 "Import Project"。
3.  选择您的 GitHub 仓库。
4.  **重要**: 在 "Environment Variables" 部分添加您的 `PUBLIC_UMAMI_WEBSITE_ID`。
5.  点击 "Deploy"。

 Vercel 会自动检测 Astro 项目并进行构建和部署。后续的 `git push` 将触发自动更新。

### 其他平台

- **Netlify**: 部署流程与 Vercel 类似。
- **Cloudflare Pages**: 同样支持自动部署。
- **自托管**: 运行 `pnpm build` 后，将 `dist/` 目录下的所有文件部署到您的服务器。

---

## ✍️ 内容创作

### 创建新文章

使用以下命令快速创建文章模板：

```bash
# 创建一篇中文文章
pnpm new-post my-awesome-article

# 创建一篇英文文章 (用于多语言)
pnpm new-post my-awesome-article.en
```

文章将创建在 `src/content/posts/` 目录下。

### Front Matter

文章头部的 Front Matter 用于配置文章元数据：

```yaml
---
title: "文章标题"
description: "文章描述，用于 SEO"
pubDate: "2025-11-10"
heroImage: "/images/post-cover.png" # 文章封面图
tags: ["技术", "Astro"]
lang: "zh_CN" # 语言 (zh_CN, en)
---
```

---

## 📄 许可证

本项目基于 [MIT License](https://github.com/saicaca/fuwari/blob/main/LICENSE) 开源。
