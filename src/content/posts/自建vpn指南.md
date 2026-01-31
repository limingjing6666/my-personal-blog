---
title: 自建vpn指南
published: 2026-01-31
description: 自建vpn
#image: ""
tags: [vpn]
category: 指南
draft: false
---

## 自建梯子指南

> 本文提供从服务器初始化到面板部署、节点配置、客户端使用及常见问题的完整步骤（适用于有一定 Linux 基础的用户）。

<!-- TOC -->
- [服务器环境初始化](#server)
- [部署 3X-UI 可视化面板](#panel)
- [创建 VLESS + Reality 节点（核心配置）](#core)
- [客户端使用指南（Windows / Android）](#client)
- [常见问题排查](#faq)
- [结语](#conclusion)

<a id="server"></a>
## 1. 服务器环境初始化
⚠️ 重要前提： 本教程仅适用于中国大陆以外（如中国香港、新加坡、美国、日本等）的服务器。国内服务器（如阿里云北京、腾讯云上海）因位于防火墙内，无法访问国际互联网，无法用于搭建此服务。

通过 SSH 连接服务器（推荐 Ubuntu 24.04），接下来对系统内核和防火墙进行初始化设置。

### 1.1 开启 BBR 加速（让速度更稳定/更快）

大多数境外云服务器在跨海连接时（特别是晚高峰）都面临丢包和高延迟的问题。开启 Google BBR 拥塞控制算法可以优化 TCP 传输，显著提升网络吞吐量和稳定性。

将以下内容复制并粘贴到终端运行：

```bash
# 写入内核配置
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf

# 使配置生效
sysctl -p

# 验证：若输出包含 tcp_bbr 则成功
lsmod | grep bbr
```

### 1.2 配置防火墙（UFW）

Ubuntu 默认可能启用 UFW，建议提前放行必要端口：

```bash
# 放行 SSH（防止把自己锁在门外）
ufw allow 22/tcp

# 放行 HTTPS（Reality 协议需占用 443）
ufw allow 443/tcp
```

<a id="panel"></a>
## 2. 部署 3X-UI 可视化面板

3X-UI（MHSanaei 分支）提供 Web 管理后台，便于可视化配置与维护。

### 2.1 运行一键安装脚本

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

### 2.2 安装过程交互指南

脚本会询问若干选项，建议如下选择：

- `Do you want to install 3x-ui? [y/n]`：输入 `y`
- `Username`：设置登录用户名（例如 `admin`，建议使用复杂些的用户名）
- `Password`：设置登录密码并妥善保存
- `Port`：建议改为 `20530`（或任意 10000-65000 的端口）以避开默认端口
- `Choose SSL certificate setup`：输入 `2`（为 IP 自动申请证书，启用 HTTPS）

> 选项 2 会为 IP 自动申请证书，使面板支持 HTTPS，更安全。

### 2.3 放行面板端口（重要）

安装完成后，放行你设置的面板端口，例如：

```bash
ufw allow 20530/tcp  # 将 20530 替换为你实际设置的端口
```

<a id="core"></a>
## 3. 核心配置：创建 VLESS + Reality 节点

这是最关键的一步，请耐心按步骤操作。

### 3.1 登录面板

在浏览器中访问：

```
https://你的服务器IP:20530
```

> 如果浏览器提示证书不安全，选择继续访问（因为面板使用自签名或刚申请的证书）。

### 3.2 添加入站（示例配置）

登录后进入「入站列表」→「添加入站」，按下表填写（未提到项保持默认）：

| 参数项     | 推荐设置                 | 说明               |
|------------|-------------------------|--------------------|
| Name       | 随意（例如 MyProxy）     |                    |
| 协议       | `vless`                 | 必选               |
| 监听 IP    | (留空)                  | 千万不要填 443，留空代表 0.0.0.0 |
| 端口       | `443`                   | Reality 协议通常使用 443 |
| 流量 (Flow) | `xtls-rprx-vision`      | 防封锁核心技术     |
| 安全       | `reality`               | 勾选               |
| uTLS       | `chrome`                | 模拟浏览器指纹     |
| Dest       | `www.microsoft.com:443` | 伪装目的地址       |
| SNI        | `www.microsoft.com`     | 与 Dest 保持一致   |
| Key        | 点击 `Get New Key`      | 生成并填写         |

填写完成后点击「添加」保存。

<a id="client"></a>
## 4. 客户端使用指南（电脑 & 手机）

### 4.1 获取连接信息

在面板「入站列表」中，找到对应条目，点击「操作」→「二维码 / 复制链接」。

### 4.2 Windows（v2rayN）

1. 下载 v2rayN（选择包含 core 的发行包）。
2. 解压到无中文路径的目录。
3. 打开 `v2rayN.exe`，按 `Ctrl+V` 粘贴链接导入节点。
4. 检查：流控为 `xtls-rprx-vision`、端口为 `443`。
5. 启动代理：系统托盘右键 → 系统代理 → 选择「自动配置系统代理」。图标变色表示已连接。
6. 验证：访问 `www.google.com` 或通过其他服务确认连通性。

### 4.3 Android（v2rayNG）

1. 下载 v2rayNG（现代手机选 `arm64-v8a`，老旧设备选 `universal`）。
2. 打开 App，点击右上角 `+` → 「扫描二维码」或「从剪贴板导入」。
3. 选中节点，点击右下角连接按钮，出现 `Connected` 即表示成功。


## 结语
祝你一切顺利！！！



