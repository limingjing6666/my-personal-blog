---
title: 国内服务器 Docker 安装部署文档
published: 2025-05-09
description: 国内服务器 Docker 安装部署指南
# image: ./cover.jpg
tags: [Docker]
category: 指南
draft: false
---

## 目录
1. [环境要求](#环境要求)  
2. [安装步骤](#安装步骤)  
   - 2.1 [卸载旧版本](#卸载旧版本)  
   - 2.2 [安装依赖工具](#安装依赖工具)  
   - 2.3 [配置国内镜像源](#配置国内镜像源)  
   - 2.4 [安装 Docker CE](#安装-docker-ce)  
   - 2.5 [配置镜像加速器](#配置镜像加速器)  
   - 2.6 [启动与验证](#启动与验证)  
3. [常见问题](#常见问题)  
4. [扩展配置](#扩展配置)  
5. [注意事项](#注意事项)  

---

## 环境要求
- **操作系统**：CentOS 7+/Ubuntu 18.04+/Debian 10+  
- **权限要求**：`root` 或具备 `sudo` 权限的用户  

---

## 安装步骤

### 卸载旧版本
```bash
# Debian/Ubuntu 系统
sudo apt-get remove docker docker-engine docker.io containerd runc

# CentOS/RHEL 系统
sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```
> **说明**：确保旧版本残留组件已清理，避免冲突。

---

### 安装依赖工具
```bash
# Debian/Ubuntu 系统
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# CentOS/RHEL 系统
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```
> **说明**：安装 HTTPS 协议支持及软件源管理工具。

---

### 配置国内镜像源
#### 1. 添加 GPG 密钥
```bash
# 使用阿里云镜像源（通用命令）
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

#### 2. 配置软件源地址
```bash
# Debian/Ubuntu
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# CentOS/RHEL
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
> **说明**：替换为阿里云镜像源，大幅提升下载速度。

---

### 安装 Docker CE
```bash
# Debian/Ubuntu
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# CentOS/RHEL
sudo yum makecache fast
sudo yum install -y docker-ce docker-ce-cli containerd.io
```
> **说明**：默认安装最新稳定版，如需指定版本可在包名后追加版本号（如 `docker-ce-20.10.17`）。

---

### 配置镜像加速器
1. 创建配置文件 `/etc/docker/daemon.json`：
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://1nj0zren.mirror.aliyuncs.com",  # 阿里云（需替换为自己的加速地址）
    "https://docker.mirrors.ustc.edu.cn"     # 中科大
  ]
}
EOF
```
2. 重启 Docker 生效：
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

---

### 启动与验证
```bash
# 启动服务并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker

# 验证版本
docker --version

# 运行测试容器
docker run --rm hello-world
```
> **成功标志**：终端输出 `Hello from Docker!`。

---

## 常见问题

### 1. 权限不足
```bash
# 将当前用户加入 docker 用户组
sudo usermod -aG docker $USER
newgrp docker  # 或重新登录终端
```

### 2. 镜像拉取失败
- 检查 `/etc/docker/daemon.json` 格式是否正确（JSON 无注释）。  
- 更换其他镜像源（如腾讯云 `https://mirror.ccs.tencentyun.com`）。

### 3. 防火墙拦截
```bash
# CentOS 临时关闭防火墙
sudo systemctl stop firewalld

# Ubuntu 临时关闭防火墙
sudo ufw disable
```

---

## 扩展配置

### 1. 安装 Docker Compose
```bash
# 下载最新版本（替换版本号）
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

### 2. 开启远程 API（谨慎使用）
```bash
# 修改 Docker 服务配置
sudo sed -i 's#ExecStart=/usr/bin/dockerd#ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375#' /lib/systemd/system/docker.service
sudo systemctl daemon-reload && sudo systemctl restart docker
```

---

## 注意事项
1. **安全风险**：避免直接关闭防火墙，建议按需开放端口（如 2375 仅限内网）。  
2. **镜像加速器**：阿里云镜像地址需替换为[控制台获取的专属地址](https://cr.console.aliyun.com)。  
3. **版本兼容性**：生产环境建议锁定 Docker 版本，避免自动升级导致异常。  

---

**文档版本**：v1.1  
**更新日期**：2023-10-05  
**参考链接**：[Docker 官方文档](https://docs.docker.com) | [阿里云镜像帮助](https://help.aliyun.com/document_detail/60750.html)  
