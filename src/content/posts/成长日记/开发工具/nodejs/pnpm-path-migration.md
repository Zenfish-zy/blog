---
title: pnpm 路径迁移完全指南
published: 2026-01-27
tags:
  - pnpm
category: 成长日记/开发工具
description: 将 pnpm 的所有数据（缓存、全局包、硬链接仓库）从系统盘迁移到其他位置，以节省 C 盘空间并统一管理开发环境。
---

# pnpm 路径迁移完全指南

### 目标

将 pnpm 的所有数据（缓存、全局包、硬链接仓库）从系统盘（C 盘）迁移到 **`E:\Developer\pnpm`**，以节省 C 盘空间并统一管理开发环境。

------

### 第一步：准备工作

1. 打开资源管理器。
2. 手动创建文件夹：**`E:\Developer\pnpm`**。

------

### 第二步：修改 pnpm 配置 (核心)

打开终端（PowerShell 或 CMD），**依次执行**以下 5 条命令。 *注意：必须加上 `-g` 参数，确保配置写入全局用户文件，否则不生效。*

PowerShell

```powershell
# 1. 设置包的物理存储位置（最占空间的部分）
pnpm config set store-dir "E:\Developer\pnpm\store" -g

# 2. 设置全局安装包的存储位置
pnpm config set global-dir "E:\Developer\pnpm\global" -g

# 3. 设置全局命令（如 astro, create-react-app）的启动文件位置
pnpm config set global-bin-dir "E:\Developer\pnpm" -g

# 4. 设置状态文件位置
pnpm config set state-dir "E:\Developer\pnpm\state" -g

# 5. 设置缓存位置
pnpm config set cache-dir "E:\Developer\pnpm\cache" -g
```

------

### 第三步：配置 Windows 环境变量

这一步是为了让系统能找到你在新位置安装的全局工具（比如 `astro`）。

1. 按 `Win + S` 搜索 **"编辑系统环境变量"** 并打开。
2. 点击 **"环境变量"** 按钮。
3. 在 **"用户变量"** (User variables) 区域，找到并选中 **`Path`**，点击 **"编辑"**。
4. **执行操作**：
   - ❌ **删除**旧路径：`C:\Users\你的用户名\AppData\Local\pnpm`
   - ✅ **新建**新路径：`E:\Developer\pnpm`
5. 连续点击 **"确定"** 保存退出。

> ⚠️ **注意**：修改环境变量后，必须**重启所有已打开的终端/编辑器**（如 VSCode、PowerShell），新设置才会生效。

------

### 第四步：验证与清理

**1. 验证配置** 打开一个新的终端窗口，输入：

PowerShell

```powershell
pnpm config get store-dir
```

- **正确输出**：`E:\Developer\pnpm\store`
- **错误输出**：`undefined` (说明没加 `-g`) 或 `C:\...` (说明没生效)

**2. 清理旧文件 (释放空间)** 确认配置无误后，可以直接删除以下旧文件夹：

- `C:\Users\你的用户名\AppData\Local\pnpm`
- `C:\Users\你的用户名\.pnpm-store`
- `E:\.pnpm-store` (如果之前配置未生效导致误生成的)

------

### 常见问题 (FAQ)

- **Q: 为什么 E 盘根目录突然出现了 `.pnpm-store`？**
  - **A**: 这通常是因为 `store-dir` 配置未生效（忘了加 `-g`），或者使用了旧的终端窗口运行命令。pnpm 找不到指定路径，就会默认在同盘根目录创建该文件夹。
- **Q: 为什么安装了全局工具（如 `npm i -g vercel`）后提示找不到命令？**
  - **A**: 检查环境变量 `Path` 是否正确添加了 `E:\Developer\pnpm`，并确保重启了终端。
