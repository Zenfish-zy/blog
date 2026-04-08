---
title: Tailscale 内网穿透组网教程
published: 2026-02-05T00:00:00.000Z
tags:
  - Tailscale
  - 内网穿透
  - 组网
category: 系统与网络/内网穿透
description: Tailscale 零配置内网穿透方案，实现跨网络 SSH 连接和文件传输
---

Tailscale 是目前 **在校园网、公司内网、无公网 IP 环境** 下远程访问服务器最简单、最稳的方案。

## 🧩 一、Tailscale 是什么？

> Tailscale = 一种安全、自动穿透 NAT 的虚拟专用网络（基于 WireGuard 协议）。

你所有登录同一账号的设备会自动组成一个「虚拟局域网」，彼此可直接通信。

✅ 优点：
- 无需公网 IP
- 无需开端口
- 自动 NAT 穿透
- 支持 Linux / Windows / macOS / Android
- 支持 SSH、文件传输

## 🚀 二、在 Ubuntu 服务器上安装并启动

### 1️⃣ 安装 Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

### 2️⃣ 启动并登录

```bash
sudo tailscale up
```

终端会输出认证链接，用浏览器打开并登录（支持 Google、GitHub、Microsoft）。

### 3️⃣ 查看虚拟 IP

```bash
tailscale ip -4
```

## 💻 三、在本地电脑上安装 Tailscale

访问 https://tailscale.com/download 下载并安装客户端，登录同一个账号。

## 🔐 四、从本地连接服务器（SSH）

```bash
ssh guest@100.121.87.43
```

## 📂 五、文件传输

```bash
# 上传文件到服务器
tailscale file cp example.txt 100.121.87.43:

# 在服务器查看接收的文件
tailscale file list
```

## 🧰 六、常用命令大全

| 功能           | 命令                                             |
| -------------- | ------------------------------------------------ |
| 查看设备信息   | tailscale status                                 |
| 查看本机 IP    | tailscale ip -4                                  |
| 启动 Tailscale | sudo tailscale up                                |
| 停止 Tailscale | sudo tailscale down                              |
| 登出账号       | sudo tailscale logout                            |

## 🌐 七、进阶功能

### 开启 Tailscale SSH（免密登录）

```bash
sudo tailscale up --ssh
```

### 子网路由（访问内网其他设备）

```bash
sudo tailscale up --advertise-routes=192.168.1.0/24
```
