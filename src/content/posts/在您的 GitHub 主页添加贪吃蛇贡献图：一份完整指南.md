---
title: github主页添加贪吃的贡献图指南
published: 2025-11-19
description: snk
tags: [github,snk]
category: 指南
draft: false
---

## 引言

您是否曾惊叹于一些 GitHub 个人主页上动态展示的贪吃蛇动画，它巧妙地“吞噬”着用户的贡献日历？这个有趣的功能不仅能为您的主页增添一抹亮色，还能以一种新颖的方式展示您的编程活动。本文将为您提供一份详尽的指导，帮助您一步步完成从创建仓库到最终在主页上展示贪吃蛇贡献图的全过程。

这个功能的核心是 [Platane/snk](https://github.com/Platane/snk) 项目，这是一个开源的 GitHub Action，能够读取您的贡献数据，并将其渲染成一个贪吃蛇游戏的动画，支持输出为 SVG 或 GIF 格式。

---

## 准备工作：创建您的 Profile README 仓库

在开始之前，您需要一个特殊的 GitHub 仓库来展示您的个人主页。这个仓库的名称必须与您的 GitHub 用户名完全相同。如果您已经拥有该仓库，可以跳过此步骤。

### 创建步骤

根据 GitHub 官方文档，创建 Profile README 仓库的步骤如下：

1.  登录您的 GitHub 账户，在页面右上角点击 **+** 号，然后选择 **New repository**（新建仓库）。
2.  在 **Repository name**（仓库名称）字段中，输入与您的 GitHub 用户名**完全匹配**的名称。例如，如果您的用户名是 `username`，那么仓库名称也必须是 `username`。
3.  将仓库设置为 **Public**（公开）。这是让您的主页对他人可见的必要条件。
4.  勾选 **Add a README file**（添加一个 README 文件）选项。这将为您创建一个 `README.md` 文件，作为您个人主页的内容载体。
5.  点击 **Create repository**（创建仓库）完成创建。

创建成功后，这个仓库中的 `README.md` 文件的内容将会自动显示在您的 GitHub 个人主页顶部。

---

## 核心步骤：配置 GitHub Action

接下来，我们将通过 GitHub Actions 自动化生成和更新贪吃蛇动画。这需要在您的 Profile README 仓库中创建一个 workflow 文件。

### 第一步：创建 Workflow 文件

1.  进入您刚刚创建的与用户名同名的仓库。
2.  在仓库根目录下创建一个名为 `.github` 的文件夹，如果它不存在的话。
3.  在 `.github` 文件夹内，再创建一个名为 `workflows` 的文件夹。
4.  在 `workflows` 文件夹内，创建一个名为 `snake.yml` 的文件。

最终的目录结构应如下所示：

```
.github/
└── workflows/
    └── snake.yml
```

### 第二步：编写 `snake.yml` 文件内容

将以下 YAML 代码复制并粘贴到 `snake.yml` 文件中。这是一个推荐的基础配置，它会每天自动运行一次，并在您每次推送到 `main` 分支时触发更新。

```yaml
name: Generate Snake Animation

# 控制工作流的触发时机
on:
  # 每天 UTC 时间午夜 00:00 自动运行
  schedule:
    - cron: "0 0 * * *"
  # 允许您在 Actions 标签页手动触发
  workflow_dispatch:
  # 当推送到 main 分支时触发
  push:
    branches:
      - main

# 定义一个名为 'generate' 的作业
jobs:
  generate:
    # 设置作业所需的权限，允许写入内容
    permissions:
      contents: write
    # 指定运行环境为最新的 Ubuntu
    runs-on: ubuntu-latest
    # 设置超时时间，防止作业无限期运行
    timeout-minutes: 10

    # 作业的执行步骤
    steps:
      # 第一步：生成贪吃蛇动画文件
      - name: Generate snake.svg
        # 使用 Platane/snk 的最新版本 v3
        uses: Platane/snk@v3
        with:
          # 您的 GitHub 用户名，`github.repository_owner` 会自动获取
          github_user_name: ${{ github.repository_owner }}
          # 定义输出文件和样式
          # outputs: [输出路径]?palette=[调色板]&color_snake=[蛇颜色]&color_dots=[点颜色]
          outputs: |
            dist/github-snake.svg
            dist/github-snake-dark.svg?palette=github-dark
            dist/ocean.gif?color_snake=orange&color_dots=#bfd6f6,#8dbdff,#64a1f4,#4b91f1,#3c7dd9

      # 第二步：将生成的文件推送到 output 分支
      - name: Deploy to GitHub Pages
        # 使用 crazy-max/ghaction-github-pages 工具
        uses: crazy-max/ghaction-github-pages@v4
        with:
          # 目标分支，建议使用 'output' 以保持主分支整洁
          target_branch: output
          # 构建目录，与上一步的输出路径 'dist' 对应
          build_dir: dist
        env:
          # GITHUB_TOKEN 是一个特殊的 secret，用于授权操作
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 第三步：配置仓库权限

为了让 GitHub Action 能够成功地将生成的文件写入您的仓库，您需要为其授予正确的权限。这是一个非常关键但容易被忽略的步骤。

1.  在您的仓库页面，点击 **Settings**（设置）。
2.  在左侧导航栏中，选择 **Actions** -> **General**。
3.  向下滚动到 **Workflow permissions**（工作流权限）部分。
4.  选择 **Read and write permissions**（读写权限）。
5.  点击 **Save**（保存）。

### 第四步：运行 Action 并验证结果

提交 `snake.yml` 文件后，您可以前往仓库的 **Actions** 标签页查看工作流的运行情况。

1.  点击 **Generate Snake Animation** 工作流。
2.  您可以等待它按计划自动运行，或者点击 **Run workflow** 手动触发一次。
3.  当工作流成功运行后（显示绿色对勾），切换到名为 `output` 的新分支。
4.  您应该能在这个分支下看到生成的 `github-snake.svg`、`github-snake-dark.svg` 和 `ocean.gif` 文件。

---

## 最后一步：在主页展示您的贪吃蛇

现在，万事俱备，只欠东风。回到您的 `main` 分支，编辑 `README.md` 文件，将以下代码片段添加到您希望展示动画的位置。

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/您的用户名/您的用户名/output/github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/您的用户名/您的用户名/output/github-snake.svg" />
  <img alt="github-snake" src="https://raw.githubusercontent.com/您的用户名/您的用户名/output/github-snake.svg" />
</picture>
```

**重要提示**：请务必将代码中的 `您的用户名` 替换为您自己的 GitHub 用户名。

提交更改后，访问您的 GitHub 个人主页（`https://github.com/您的用户名`），您应该就能看到动态的贪吃蛇在您的贡献图上“游走”了！

---

## 高级定制与技巧

### 自定义颜色和样式

`Platane/snk` 提供了丰富的自定义选项。您可以在 `snake.yml` 文件的 `outputs` 部分通过查询参数来调整样式。

-   **调色板 (`palette`)**: 预设的颜色主题，例如 `github-dark`、`github-light`。
-   **蛇的颜色 (`color_snake`)**: 使用十六进制颜色代码或颜色名称，如 `orange` 或 `#FF0000`。
-   **贡献点颜色 (`color_dots`)**: 用逗号分隔的五种颜色，分别对应从无贡献到高贡献的五个等级。

**示例**：
```yaml
outputs: |
  dist/my-snake.svg?color_snake=blue&color_dots=#ebedf0,#9be9a8,#40c463,#30a14e,#216e39
```
---

## 常见问题解答 (FAQ)

| 问题 | 解决方案 |
| :--- | :--- |
| **Actions 运行失败** | 前往仓库的 **Actions** 标签页，点击失败的工作流查看详细的错误日志。通常是 YAML 语法错误或权限问题。 |
| **图片无法显示** | 1. 确认图片 URL 是否正确，特别是用户名和分支名。 2. 检查 `output` 分支是否存在且包含生成的图片。 3. 尝试清除浏览器缓存或在隐私模式下查看。 |
| **权限错误** | 确保您已按照本文的指导，在仓库的 **Settings -> Actions -> General** 中设置了 **Read and write permissions**。 |
