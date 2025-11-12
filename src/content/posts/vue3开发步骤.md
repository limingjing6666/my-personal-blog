---
title: Windows 11 系统 Vue 3 开发指南
published: 2025-05-13
description: Windows 11 系统 Vue 3 快速开发指南
# image: ./cover.jpg
tags: [win11, vue3]
category: 指南
draft: false
---

## 一、环境准备
### 1. 安装 Node.js 和 npm
- **下载地址**：[Node.js 官网](https://nodejs.org)  
  - 选择 **LTS 版本**（推荐 18.x+）
  - 安装时勾选 **`Add to PATH`**（自动配置环境变量）


### 2. 配置 npm 镜像加速（国内用户）
```powershell
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
```

---

## 二、安装 Vue CLI 脚手架
```powershell
# 全局安装 Vue CLI（需管理员权限）
npm install -g @vue/cli

# 验证安装
vue --version
```
> **权限问题处理**：  
> 若提示权限错误，用管理员身份打开 PowerShell 或 CMD 执行命令。

---

## 三、创建 Vue 3 项目
### 方法 1：命令行创建（推荐）
```powershell
# 初始化项目（项目名不能含大写字母）
vue create my-vue3-app
```
**操作流程**：
1. 选择 **`Manually select features`**  
2. 勾选以下特性（按空格选择）：
   - `Babel`
   - `TypeScript`（可选）
   - `Router`
   - `Vuex`
   - `CSS Pre-processors`
3. 选择 **`Vue 3`** 版本  
4. 其他配置按需选择（如 Sass 预处理器）

### 方法 2：Vite 快速创建（轻量级）
```powershell
npm create vue@latest
# 按提示选择配置
```

---

## 四、开发环境配置
### 1. 启动开发服务器
```powershell
cd my-vue3-app
npm run dev  # Vite 项目
# 或
npm run serve  # Vue CLI 项目
```
- 访问 `http://localhost:3000`（Vite）或 `http://localhost:8080`（Vue CLI）

### 2. 解决 Windows 特有问题
#### 🔸 端口被占用
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 终止进程（替换 PID）
taskkill /PID 1234 /F
```

#### 🔸 文件路径问题
- **错误示例**：`Error: EPERM: operation not permitted`  
  **解决方案**：  
  1. 关闭 VSCode/IDE 后重试  
  2. 以管理员身份运行终端  
  3. 检查杀毒软件/防火墙是否拦截

---

## 五、Windows 开发优化
### 1. 使用 WSL2 开发（推荐）
```powershell
# 在 WSL2（Ubuntu）中安装环境
sudo apt update && sudo apt install nodejs npm
npm install -g @vue/cli
```
- 项目文件存放在 WSL 文件系统（`\\wsl$` 访问）  
- 开发命令与 Linux 一致，避免路径问题

### 2. 配置 VSCode 插件
- **必装插件**：  
  - `Volar`（Vue 3 官方支持）  
  - `ESLint`  
  - `Prettier`  
  - `WSL`（若使用 WSL2）

### 3. 环境变量管理
```powershell
# 创建 .env 文件
VITE_API_BASE_URL=http://localhost:8000
```
```js
// 代码中调用
import.meta.env.VITE_API_BASE_URL
```

---

## 六、生产部署
### 1. 构建项目
```powershell
npm run build
```
- 生成 `dist` 目录（部署到 Nginx/Apache）

### 2. Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root   /path/to/dist;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 七、常见问题汇总
| 问题现象 | 解决方案 |
|---------|----------|
| `vue : 无法加载文件... 禁止运行脚本` | 以管理员身份运行 PowerShell，执行：<br>`Set-ExecutionPolicy RemoteSigned` |
| `npm install 卡顿` | 检查镜像源是否为淘宝源，或使用 `yarn` |
| `ESLint 报错换行符问题` | 在 `.eslintrc.js` 中添加：<br>`"linebreak-style": ["error", "windows"]` |
| `VSCode 中 Vue 文件无高亮` | 安装 `Volar` 扩展并禁用 `Vetur` |

---

## 八、进阶配置
### 1. 使用 Yarn 替代 npm
```powershell
# 安装 Yarn
npm install -g yarn

# 常用命令
yarn install
yarn dev
yarn build
```

### 2. 添加 Windows 右键菜单快速启动
1. 新建 `vue-dev.reg` 文件，写入：  
```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\Vue Dev]
@="启动 Vue 开发服务器"
"Icon"="C:\\Path\\To\\Node.js\\node.exe"

[HKEY_CLASSES_ROOT\Directory\Background\shell\Vue Dev\command]
@="powershell -NoExit -Command \"cd '%V' && npm run dev\""
```
2. 双击运行注册表文件添加菜单

---

**文档版本**：v1.2  
**适用系统**：Windows 11 21H2+  
**参考链接**：[Vue 3 官方文档](https://vuejs.org) | [Vite 文档](https://vitejs.dev)  
