---
title: WSL2 完整参考手册
published: 2026-02-05
tags:
  - WSL
  - Windows
  - Linux
category: 成长日记/Linux
description: WSL2 安装、迁移、优化与维护的完整技术指南
---

# WSL2 完整参考手册 (全流程版)

## 1. 安装与初始化

*系统要求：Windows 10 (Build 19041+) 或 Windows 11*

### 检查虚拟化

- 打开任务管理器 -> 性能 -> CPU。
- 确认右下角显示 **虚拟化：已启用**。
- *若未启用，需进入 BIOS 开启 Intel VT-x 或 AMD-V。*

### 执行安装

**一键安装默认版本 (Ubuntu)**：

```powershell
wsl --install
```

*安装后必须重启计算机。*

**安装指定版本**：

```powershell
# 查看可用列表
wsl --list --online
# 安装指定发行版 (如 Debian)
wsl --install -d Debian
```

### 初始化配置

重启后终端自动弹出，按提示设置：
1. `Enter new UNIX username`: 输入用户名 (建议纯小写英文)。
2. `New password`: 输入密码 (**注意：输入时屏幕不显示任何字符**，直接回车)。

------

## 2. 核心生命周期控制 (启停与状态)

### 启动与进入

```powershell
# 启动默认系统
wsl

# 启动指定系统
wsl -d Ubuntu-22.04

# 以 Root 用户身份登录
wsl -u root
```

### 退出与关闭

```powershell
# 退出当前终端
exit  # 或 Ctrl + D

# 关闭指定系统 (释放内存)
wsl --terminate Ubuntu-22.04

# 彻底关闭所有 WSL 实例
wsl --shutdown
```

### 查看状态

```powershell
wsl -l -v
```

------

## 3. 系统迁移 (更改安装路径)

*默认在 C 盘，建议安装后立即迁移至 D 盘。*

### 方案 A：在线热迁移 (推荐)

```powershell
# 1. 确保目标目录存在
mkdir D:\WSL\Ubuntu

# 2. 彻底关闭 WSL
wsl --shutdown

# 3. 执行迁移
wsl --manage Ubuntu-22.04 --move D:\WSL\Ubuntu
```

### 方案 B：导入导出法

```powershell
# 1. 导出备份
wsl --export Ubuntu-22.04 D:\backup.tar

# 2. 注销原系统
wsl --unregister Ubuntu-22.04

# 3. 导入到新位置
wsl --import Ubuntu-22.04 D:\WSL\Ubuntu D:\backup.tar --version 2
```

------

## 4. 环境与性能优化

### 更换国内源

```bash
# 1. 备份源文件
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 2. 替换为阿里云镜像
sudo sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sudo sed -i 's/security.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list

# 3. 更新缓存
sudo apt update
```

### 内存与 CPU 限制

在 Windows 用户目录创建 `.wslconfig` 文件：

```ini
[wsl2]
memory=4GB
processors=2
swap=4GB
```

*修改后需执行 `wsl --shutdown` 生效。*

------

## 5. 交互与文件管理

### 文件互通

- 在 Windows 访问 Linux 文件：`explorer.exe .`
- 在 Linux 访问 Windows 文件：`cd /mnt/c/Users/你的用户名/Desktop`

### VS Code 集成

1. Windows 端安装 VS Code
2. VS Code 安装插件 **"WSL"**
3. 在 Linux 终端项目目录下输入：`code .`

------

## 6. 磁盘维护 (空间回收)

```cmd
wsl --shutdown
diskpart
select vdisk file="D:\WSL\Ubuntu\ext4.vhdx"
attach vdisk readonly
compact vdisk
detach vdisk
exit
```
