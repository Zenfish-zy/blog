---
title: FRP 跨局域网 SSH 互通搭建
published: 2026-02-05T00:00:00.000Z
tags:
  - FRP
  - 内网穿透
  - SSH
category: 系统与网络/内网穿透
description: 基于 FRP 的跨局域网多设备 SSH 互通系统搭建，通过公网服务器作为中转节点实现内网设备之间的安全 SSH 连接
---

# 基于 FRP 的跨局域网多设备 SSH 互通系统搭建记录

**目标：** 通过一台拥有公网 IP 的 Linux 云服务器作为中转节点（FRPS），实现多台处于不同内网的设备（Windows A、Linux C …）之间的安全、稳定 SSH 互联。

# 1. 系统结构

- **云服务器（CentOS / Ubuntu）** 公网 IP：`101.42.100.164` 安装并运行 FRPS 服务端。
- **Windows A（内网）** 安装 FRPC，将本地 SSH 服务映射到云服务器端口 `6001`。
- **Linux C（内网）** 安装 FRPC，将本地 SSH 服务映射到云服务器端口 `6003`。

云服务器作为统一转发入口，最终形成：

```text
Windows A ←→ 云服务器（FRPS） ←→ Linux C
```

任意设备均可通过 `ssh user@101.42.100.164 -p 对应端口` 登录其它内网主机。

# 2. 云服务器部署 FRPS

## 2.1 下载并解压 FRP

```bash
cd ~
wget https://github.com/fatedier/frp/releases/download/v0.60.0/frp_0.60.0_linux_amd64.tar.gz
tar -zxvf frp_0.60.0_linux_amd64.tar.gz
cd frp_0.60.0_linux_amd64
```

## 2.2 编写 frps.toml

编辑配置文件：

```bash
nano frps.toml
```

内容如下（可直接使用）：

```toml
bindAddr = "0.0.0.0"
bindPort = 7000

[auth]
method = "token"
token  = "my_strong_token_abc_123456"

[webServer]
addr = "0.0.0.0"
port = 7500
user = "admin"
password = "admin123"

[log]
to = "console"
level = "info"
maxDays = 7

[transport]
tcpMux    = true
tlsEnable = true
```

## 2.3 前台启动 FRPS（测试）

```bash
./frps -c ./frps.toml
```

看到类似：

```text
frps started successfully, listen on 0.0.0.0:7000
```

表示服务成功启动。

# 3. 云服务器（控制台）开放 TCP 端口（非常关键）

进入腾讯云轻量应用服务器（Lighthouse）控制台：

路径： **轻量应用服务器 → 实例详情 → 防火墙 → 新增规则**

新增以下端口：

| 端口         | 协议 | 来源      | 用途               |
| ------------ | ---- | --------- | ------------------ |
| 7000         | TCP  | 0.0.0.0/0 | FRPS 主服务端口    |
| 6001         | TCP  | 0.0.0.0/0 | Windows A SSH 映射 |
| 6003         | TCP  | 0.0.0.0/0 | Linux C SSH 映射   |
| （可选）7500 | TCP  | 0.0.0.0/0 | FRP Web 管理       |

保存后即刻生效。

# 4. 配置 Windows A（frpc）

## 4.1 安装 SSH 服务（OpenSSH Server）

Windows A 中：

**设置 → 应用 → 可选功能 → 添加 → OpenSSH Server**

安装完成后：

```powershell
Start-Service sshd
Set-Service sshd -StartupType Automatic
```

本机测试：

```powershell
ssh <你的用户名>@localhost
```

## 4.2 安装 FRPC

下载 Windows 版：

```text
frp_0.60.0_windows_amd64.zip
```

解压到：

```text
D:\software_install\Frpc\frp_0.60.0_windows_amd64
```

## 4.3 编写 frpc_win_A.toml

创建文件：

```text
frpc_win_A.toml
```

内容：

```toml
serverAddr = "101.42.100.164"
serverPort = 7000
loginFailExit = false

[auth]
method = "token"
token  = "my_strong_token_abc_123456"

[[proxies]]
name = "win_A_ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6001
```

## 4.4 启动 FRPC

```powershell
cd D:\software_install\Frpc\frp_0.60.0_windows_amd64
.\frpc.exe -c .\frpc_win_A.toml
```

成功后日志会显示：

```text
start proxy win_A_ssh success
```

# 5. 配置 Linux C（frpc）

## 5.1 启动 SSH 服务

```bash
sudo apt install openssh-server     # 或 yum install openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh
```

本机测试：

```bash
ssh $(whoami)@localhost
```

## 5.2 编写 frpc_linux_C.toml

进入解压目录，例如：

```bash
cd ~/frp_0.60.0_linux_amd64
```

创建：

```bash
nano frpc_linux_C.toml
```

写入：

```toml
serverAddr = "101.42.100.164"
serverPort = 7000
loginFailExit = false

[auth]
method = "token"
token  = "my_strong_token_abc_123456"

[[proxies]]
name = "linux_C_ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6003
```

## 5.3 启动 FRPC

```bash
cd ~/frp_0.60.0_linux_amd64
./frpc -c ./frpc_linux_C.toml
```

成功后输出：

```text
start proxy linux_C_ssh success
```

# 6. 使用 SSH 互通

### 从 Windows A 登录 Linux C：

```powershell
ssh <linuxC用户名>@101.42.100.164 -p 6003
```

### 从 Linux C 登录 Windows A：

```bash
ssh <windowsA用户名>@101.42.100.164 -p 6001
```

此时已实现跨局域网双向互通。

# 7. 云服务器后台常驻运行 FRPS（systemd）

创建服务文件：

```bash
sudo nano /etc/systemd/system/frps.service
```

写入：

```toml
[Unit]
Description=FRP Server Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/frp_0.60.0_linux_amd64
ExecStart=/root/frp_0.60.0_linux_amd64/frps -c /root/frp_0.60.0_linux_amd64/frps.toml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

运行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable frps
sudo systemctl start frps
sudo systemctl status frps
```

# 8. 连通性验证（非常关键）

在 Windows A 上：

```powershell
Test-NetConnection 101.42.100.164 -Port 7000
```

显示：

```text
TcpTestSucceeded : True
```

即表示 FRPS 端口可访问。

在云服务器上测试 SSH 是否转发成功：

```bash
journalctl -u frps -f
```

可实时看到转发日志。

# 总结

完成以上步骤后：

- 云服务器作为 FRP 转发中心
- Windows A 和 Linux C 分别通过自建 FRPC 连接到 FRPS
- 完整的跨 NAT、跨局域网 SSH 通道建立成功
- FRPS 使用 systemd 维持长期运行，自动重启

系统稳定可扩展，可随时添加更多设备（Linux B、Windows D 等），只需增加 remotePort 和对应 frpc 配置即可。
