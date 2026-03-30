---
title: UV Python 包管理器安装与卸载
published: 2026-02-05
tags:
  - Python
  - UV
  - 包管理器
category: 成长日记/Python
description: uv - 极速 Python 包管理器的多平台安装方法及卸载指南
---

# 安装 uv

## 安装方法

通过我们的独立安装程序或您选择的包管理器来安装 uv。

### 独立安装程序

uv 提供了独立安装程序用于下载和安装：

使用 `irm` 下载脚本并通过 `iex` 执行：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

通过在 URL 中包含版本号来请求特定版本：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.7.4/install.ps1 | iex"
```

### PyPI

如果从 PyPI 安装，我们建议将 uv 安装到隔离环境中，例如使用 `pipx`：

```bash
pipx install uv
```

当然，也可以使用 `pip`：

```bash
pip install uv
```

### Homebrew

```bash
brew install uv
```

### WinGet

```bash
winget install --id=astral-sh.uv  -e
```

### Scoop

```bash
scoop install main/uv
```

## 升级 uv

当 uv 通过独立安装程序安装时，它可以按需自我更新：

```bash
uv self update
```

当使用其他安装方法时，请改用包管理器的升级方法：

```bash
pip install --upgrade uv
```

## Shell 自动补全

要为 uv 命令启用 shell 自动补全：

```bash
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc
```

要为 uvx 启用 shell 自动补全：

```bash
echo 'eval "$(uvx --generate-shell-completion bash)"' >> ~/.bashrc
```

## 卸载

如需从系统中移除 uv，请按照以下步骤操作：

1. 清理存储的数据（可选）：

   ```bash
   uv cache clean
   rm -r "$(uv python dir)"
   rm -r "$(uv tool dir)"
   ```

2. 删除 uv 和 uvx 二进制文件：

   ```bash
   rm $HOME/.local/bin/uv
   rm $HOME/.local/bin/uvx
   ```
