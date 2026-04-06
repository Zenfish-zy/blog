---
title: SSH 远程服务器代理配置
published: 2026-04-06 10:54
tags:
  - proxy
  - ssh
category: proxy
description: SSH 远程服务器代理配置
---
## 🛠️ 第一阶段：环境准备与内核部署

1. **创建工作目录**：

   建议在用户目录下创建独立文件夹，方便管理。

   ```Bash
   mkdir ~/clash && cd ~/clash
   ```
   
2. **下载并准备内核**：

   从 MetaCubeX 仓库下载对应架构（通常是 amd64）的 Mihomo (Clash Meta) 内核。

   ```Bash
   # 下载（使用加速镜像或直链）
   wget -O mihomo.gz "https://github.com/MetaCubeX/mihomo/releases/download/v1.18.3/mihomo-linux-amd64-v1.18.3.gz"
   # 解压并赋权
   gunzip mihomo.gz
   mv mihomo-linux-amd64-v1.18.3 mihomo
   chmod +x mihomo
   ```

------

## 🌐 第二阶段：订阅处理与配置缝合

这是最关键的一步，决定了内核能否读懂你的节点。

1. **订阅转换（核心）**：

   - **不要直接下载**机场原始链接（通常是 Base64 或 HTML）。
   - 使用[在线转换工具](https://www.google.com/search?q=https://api.wcc.best/&authuser=1)，将原始链接转换为 **Clash/Clash Meta** 格式。

2. **配置文件下载**：

   ```Bash
   wget -O config.yaml "你的转换后链接"
   ```

3. **检查并注入控制参数**：

   确保配置文件开头包含外部控制端口，否则面板无法连接。 9090是**Clash (Mihomo) 内核默认指定的外部控制端口**，一般config.yaml都有`external-controller: 0.0.0.0:9090`这一行配置

   ```Bash
   # 检查是否已有端口配置
   grep "external-controller" config.yaml
   # 如果没有，手动插入到文件第一行
   sed -i '1i\external-controller: 0.0.0.0:9090\nsecret: ""' config.yaml
   ```

------

## 🚀 第三阶段：运行与远程受控

1. **后台启动内核**：

   使用 `nohup` 确保退出 SSH 后程序继续运行。

   ```Bash
   nohup ./mihomo -d . > ~/mihomo.log 2>&1 &
   ```

2. **建立 SSH 隧道（本地操作）**：

   这是连接本地浏览器和远程内核的“秘密通道”。在**本地电脑**的终端执行：

   ```PowerShell
   # 将本地 9090（也可选其他端口，只要可用） 映射到服务器的 9090
   ssh -p [服务器ssh端口] -L 9090:127.0.0.1:9090 [用户名]@[服务器IP]
   ```

3. **使用 Web 面板控制**：

   浏览器访问 [yacd.metacubex.one](http://yacd.metacubex.one/)，API Base URL 填入 `http://127.0.0.1:9090`，即可进行**测速和节点切换**。

------

## 🧪 第四阶段：终端代理生效

内核跑起来后，需要告诉系统“流量往哪走”。

1. **临时生效**（推荐）：

   ```Bash
   export http_proxy="http://127.0.0.1:7890"
   export https_proxy="http://127.0.0.1:7890"
   ```

2. **验证测试**：

   ```Bash
   curl -I https://www.google.com
   ```
   
   在 `curl` 命令中，`-I`（大写 i）是一个非常实用的快捷方式，它的全称是 `--head`，它的核心作用：
   
   当你执行 `curl -I https://www.google.com` 时，发生了以下两件事：
   
   - **发送 HEAD 请求**：`curl` 不会使用默认的 `GET` 方法，而是发送一个 `HEAD` 请求。
   - **只显示元数据**：服务器收到后，只返回关于这个文件的信息（如：状态码、服务器类型、文件大小、有效期、Cookie 等），而不返回网页的 HTML 代码。
   
   | **优点** | **说明**                                                     |
   | -------- | ------------------------------------------------------------ |
   | **快**   | 因为不下载数据体，响应几乎是瞬间返回的。                     |
   | **清爽** | 不会像普通 `curl` 那样在终端里刷出一大堆乱七八糟的 HTML 代码。 |
   | **直观** | 你能一眼看到 `HTTP/2 200`（成功）或 `403/407`（被拒绝/需要认证）。 |
   
   ### 结果拆解
   
   当你看到下面这一串输出时，每一行含义：
   
   ```bash
   HTTP/2 200                         # 状态码：200 表示连接成功，404 是找不到，500 是服务器挂了
   content-type: text/html            # 告诉浏览器这是个网页文件
   date: Mon, 06 Apr 2026...          # 服务器的当前时间
   server: gws                        # 服务器类型（这里是 Google Web Server）
   ```

------

## ⚠️ 至关重要的注意事项

### 1. YAML 格式地雷

YAML 对缩进和空格极其敏感。如果你手动修改 `config.yaml`，请务必保证冒号后面有一个空格。如果不小心改乱了，内核会报 `Parse config error` 错误。

### 2. 端口占用冲突

如果内核启动失败（Exit 1），通常是 9090 或 7890 端口被之前的进程占用了。

- **解决方法**：执行 `sudo killall -9 mihomo` 彻底清理后再启动。

### 3. “先有鸡还是先有蛋”悖论

- **注意**：当你执行了 `export http_proxy` 后，如果代理内核还没跑起来，此时你的 `wget` 或 `curl` 会因为找不到代理而报错 `Connection refused`。
- **对策**：下载新配置前，先执行 `unset http_proxy` 恢复裸连。

### 4. 隧道稳定性

SSH 隧道（`-L` 参数）有时会因为网络波动假死。如果你发现面板连接失败（Failed to connect），即使服务器内核正常，也请重启本地的 SSH 隧道窗口。

### 5. 机场订阅陷阱

如果 `wget` 下来的文件只有几 KB 且内容是 HTML 标签，说明机场屏蔽了服务器 IP 的直接请求。此时应在本地下载好配置，再通过 `scp` 上传到服务器。
