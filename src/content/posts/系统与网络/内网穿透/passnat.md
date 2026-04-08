---
title: PassNAT 内网穿透与 Tmux 后台运行
published: 2026-02-05T00:00:00.000Z
tags:
  - PassNAT
  - 内网穿透
  - Tmux
category: 系统与网络/内网穿透
description: 使用 PassNAT 建立 SSH 隧道，并通过 Tmux 保持连接在后台稳定运行
---

# 内网穿透与后台持久化运行教程 (PassNAT + Tmux)



本教程旨在帮助你在没有公网 IP 的环境下（如实验室、校园网），通过 **PassNAT** 建立 SSH 隧道，并使用 **Tmux** 保证连接断开后程序依然在后台稳定运行。



## 准备工作



- **被控端**：一台 Linux 电脑 (Ubuntu/Debian)。
- **控制端**：一台 Windows 电脑 (安装了 Xshell 或通过 CMD/PowerShell)。
- **账号**：已注册 PassNAT 账号并创建了 TCP 隧道。

------



## 第一步：配置 PassNAT (Frpc)





### 1. 下载与安装



在 Linux 被控端终端执行：

Bash

```
# 1. 根据你的架构下载对应的 frpc (以 amd64 为例)
wget https://bucket.passnat.com/bucket-passnat/frp/frpc_0.58.1_linux_amd64 -O frpc

# 2. 赋予可执行权限 (这一步必须做，否则无法运行)
chmod +x frpc
```



### 2. 修改配置文件 (`frpc.toml`)



创建或编辑 frpc.toml 文件。

⚠️ 核心注意点：必须将 localPort 修改为 22 (SSH 端口)，千万不要用默认的 25565 (那是 Minecraft 游戏的)。

Ini, TOML

```
# frpc.toml 参考配置
serverAddr = "114.66.xxx.184"  # PassNAT 提供的服务器 IP
serverPort = 8500              # PassNAT 的握手端口

[[proxies]]
name = "my-ssh-tunnel"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22                 # <--- 关键！改为 22 才能连接 SSH
# remotePort = 3xxxx           # (注意：远程端口通常在网页端查看，不在配置文件里写)
```

------



## 第二步：使用 Tmux 后台运行



为了防止你关闭 SSH 窗口后穿透服务停止，我们需要使用 Tmux。



### 1. 安装 Tmux



Bash

```
sudo apt update
sudo apt install tmux -y
```



### 2. 创建并进入会话



创建一个名为 `frp` 的独立会话：

Bash

```
tmux new -s frp
```

*执行后，你会进入一个新的终端界面，底部通常有一条绿色的状态栏。*



### 3. 启动穿透服务



在 Tmux 会话中运行：

Bash

```
./frpc -c frpc.toml
```

**检查运行状态**：等待几秒，看到日志显示 `start proxy success` 即表示连接成功。



### 4. 挂机离开 (Detach)



这是最关键的一步，**不要按 Ctrl+C**，而是让它在后台运行：

1. 按下键盘 **`Ctrl`** + **`b`**，然后**松开双手**。
2. 快速按一下 **`d`** 键。

*此时你会退出 Tmux，回到原来的命令行，屏幕提示 `[detached]`，说明挂机成功。*

------



## 第三步：远程连接 (Windows 端)





### 1. 获取连接信息



去 PassNAT 网页后台，找到你创建的隧道，记录以下信息：

- **公网 IP** (例如: `114.66.xxx.184`)
- **远程端口 (Remote Port)** (例如: `30022`，这是一个 5 位数的端口)



### 2. 发起连接



#### 方式 A：使用 CMD / PowerShell



PowerShell

```
# 格式：ssh -p [远程端口] [Linux用户名]@[公网IP]
ssh -p 30022 jqr@114.66.xxx.184
```



#### 方式 B：使用 Xshell



- **主机 (Host)**: `114.66.xxx.184`
- **端口 (Port)**: `30022` (注意：这里填远程端口，不要填 22)
- **用户名**: `jqr`

------



## Tmux 常用指令速查表 (Cheat Sheet)



如果以后需要维护或查看日志，请查阅此表：

| **功能**                 | **指令 / 快捷键**                                            |
| ------------------------ | ------------------------------------------------------------ |
| **查看所有运行的会话**   | `tmux ls`                                                    |
| **重新进入会话 (读档)**  | `tmux attach -t frp`                                         |
| **新建会话**             | `tmux new -s 会话名`                                         |
| **彻底关闭会话**         | `tmux kill-session -t frp`                                   |
| **杀死所有 Tmux (重置)** | `tmux kill-server`                                           |
| **挂机快捷键**           | 先按 `Ctrl+b` 松手，再按 `d`                                 |
| **翻页查看日志**         | 先按 `Ctrl+b` 松手，再按 `[` (左方括号)，用方向键翻页，按 `q` 退出 |

------



---



# 使用service方法常驻后台



创建服务文件：

```bash
sudo vim /etc/systemd/system/frpc_zy.service
```

写入：

```toml
[Unit]
Description=FRP Client Service
After=network.target

[Service]
Type=simple
User=jqr
WorkingDirectory=/home/niutongzhi/pzy/frp
ExecStart=/home/niutongzhi/pzy/frp/frpc -c /home/niutongzhi/pzy/frp/frpc.toml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

运行：

```bash
sudo systemctl daemon-reload
sudo systemctl enable frpc_zy
sudo systemctl start frpc_zy
sudo systemctl status frpc_zy
```

如果要停掉：

```
sudo systemctl stop frpc_zy
```



---



## 常见问题排查



1. **连接被拒绝 (Connection Refused)**
   - 检查 `frpc.toml` 里的 `localPort` 是不是 **22**。
   - 检查 Linux 是否安装了 SSH 服务 (`sudo systemctl status ssh`)。
2. **Tmux 报错 "duplicate session"**
   - 说明会话已经存在了。直接用 `tmux attach -t frp` 进去即可。
3. **SSH 连不上，提示 Time out**
   - 检查 PassNAT 网页上的**远程端口**是否填错。
   - 检查 Linux 端 `frpc` 进程是否还在跑（用 `tmux attach` 进去看看）。
