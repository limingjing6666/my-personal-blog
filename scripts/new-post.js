/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`错误：未提供文件名参数
用法: pnpm new-post <文件名>`)
  process.exit(1) // Terminate the script and return error code 1
}

let fileName = args[0]

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`错误：文件 ${fullPath} 已存在`)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: "${args[0]}"
pubDate: "${getDate()}"
description: "在这里填写文章的简短描述"
image: ""
tags: ["标签1", "标签2"]
category: "分类"
draft: false
lang: "zh_CN"
---

## 文章标题

在这里开始编写您的文章内容...

### 小节标题

使用 Markdown 语法编写内容：

- 列表项 1
- 列表项 2
- 列表项 3

### 代码示例

\`\`\`javascript
// 这是一段示例代码
console.log("Hello, World!");
\`\`\`

### 提示框示例

:::tip[小技巧]
这是一个实用的小技巧或建议。
:::

:::note[提示]
这是一条普通的提示信息。
:::

### 总结

在这里总结您的文章内容。
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`✅ 文章 ${fullPath} 创建成功！`)
console.log("📝 现在可以编辑文件并开始写作了。")
