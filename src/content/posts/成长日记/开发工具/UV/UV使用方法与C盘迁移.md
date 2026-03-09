---
title: 以 Conda 视角快速掌握 uv
published: 2026-03-09 15:17
tags:
  - uv
category: UV
description: 用 Conda 经验无缝理解 uv，然后解决 C 盘爆红的问题。
---
太理解你了！现在 Python 社区确实有一股“弃 Conda 转 uv”的风潮。uv 主要是因为底层用 Rust 编写，速度极其夸张（安装和解析依赖比 conda/pip 快几十倍），而且把包管理和环境管理统一了。

Windows 下 C 盘爆红简直是开发者的噩梦，Conda 默认的 `pkgs` 和 `envs` 确实吃硬盘。放心，**uv 也完全可以自定义存储路径，把压力转移到其他盘**。

我们分两部分来：先用你的 Conda 经验无缝理解 uv，然后解决 C 盘爆红的问题。

------

### 一、以 Conda 视角快速掌握 uv

Conda 和 uv 最大的**核心理念差异**在于：

- **Conda 喜欢“集中式”**：环境默认都放在 `anaconda3/envs` 下，你在任何地方 `conda activate env_name` 就能用。
- **uv 喜欢“项目式”（但也支持集中）**：uv 更推荐在每个项目文件夹下建立独立的虚拟环境（默认叫 `.venv`），这和传统的 `venv` 类似，但速度极快。

下面是常用操作的“Conda 翻译对照表”：

| **你的需求**         | **Conda 怎么做**                       | **uv 怎么做**                            | **uv 的优势/区别**                                           |
| -------------------- | -------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| **安装 Python 版本** | `conda create -n myenv python=3.10`    | `uv python install 3.10`                 | uv 会自动从官方拉取对应版本的 Python，不需要预先安装。       |
| **创建虚拟环境**     | `conda create -n myenv python=3.10`    | `uv venv --python 3.10`                  | 默认在当前目录下生成 `.venv` 文件夹。不会混在一起。          |
| **激活环境**         | `conda activate myenv`                 | Windows: `.venv\Scripts\activate`        | uv 本身不提供类似 conda 那样的全局激活命令，直接用系统自带的激活方式。如果你用 `uv run`，甚至**不需要激活**就能直接运行脚本！ |
| **安装第三方包**     | `conda install numpy` 或 `pip install` | `uv pip install numpy` 或 `uv add numpy` | 速度快得离谱。如果你在项目里用了 `uv add`，它还会自动更新 `pyproject.toml`。 |
| **导出环境依赖**     | `conda env export > environment.yml`   | `uv pip freeze > requirements.txt`       | uv 也支持最新的 `pyproject.toml` 和 `uv.lock` 标准来锁定依赖。 |
| **一键运行脚本**     | `conda run -n myenv python app.py`     | `uv run app.py`                          | `uv run` 会自动识别并使用当前目录下的 `.venv` 环境，极大简化了操作。 |

> **一句话总结**：在 uv 中，你不再需要去维护一个庞大的全局环境列表。你只需要进到项目目录 -> `uv venv` -> `uv pip install` -> 开发。



------

### 二、UV安装

去[github仓库](https://github.com/astral-sh/uv/releases)下载二进制程序即可。

```bash
uv --version    # 检查命令是否可用
```



---

### 三、解决 Windows 下 uv 占用 C 盘的问题

uv 和 Conda 一样，会在后台缓存大量下载的包、Python 解释器等。在 Windows 下，它默认把东西存在 `%LOCALAPPDATA%\uv`（也就是 `C:\Users\你的用户名\AppData\Local\uv`）。

要把它迁移到 D 盘（或其他盘），我们不需要改配置文件，而是**配置 Windows 的系统环境变量**。

#### 核心的三大占用大户及对应变量：

1. **缓存 (Cache)**：占用最大，存放下载的包。对应变量 `UV_CACHE_DIR`
2. **Python 版本**：存放 `uv python install` 下载的各个版本的 Python。对应变量 `UV_PYTHON_INSTALL_DIR`
3. **全局工具 (Tools)**：存放 `uv tool` 安装的全局命令行工具。对应变量 `UV_TOOL_DIR`

#### 迁移实操步骤：

**第一步：在 D 盘创建目标文件夹**

比如你在 D 盘建一个专门放开发工具缓存的目录：

- `D:\uv_data\cache`
- `D:\uv_data\python`
- `D:\uv_data\tools`

**第二步：设置 Windows 环境变量**

1. 按 `Win` 键，搜索“**环境变量**”（或“编辑系统环境变量”），回车。
2. 点击底部的“**环境变量...**”按钮。
3. 在**“用户变量”**（上半部分）或“系统变量”（下半部分，如果你想对全电脑用户生效）中，点击“**新建**”。
4. 依次添加以下三个变量：
   - 变量名：`UV_CACHE_DIR` ，变量值：`D:\uv_data\cache`
   - 变量名：`UV_PYTHON_INSTALL_DIR` ，变量值：`D:\uv_data\python`
   - 变量名：`UV_TOOL_DIR` ，变量值：`D:\uv_data\tools`
5. 一路点击“确定”保存。

**第三步：验证并清理 C 盘**

1. **重新打开**一个新的 CMD 或 PowerShell 窗口（必须重启终端才能让环境变量生效）。

2. 输入命令检查是否生效：

   Bash

   ```bash
   uv cache dir    # 检查缓存是否成功指向 E 盘
   uv python dir   # 检查 Python 存放是否成功指向 E 盘
   ```

   如果输出的是 `D:\uv_data\cache`，说明成功了！

3. **释放 C 盘空间**：你可以放心地去 `C:\Users\你的用户名\AppData\Local\uv` 目录下，把里面的 `cache`、`python` 等文件夹直接**删除**（或者剪切到你新建的 D 盘目录里）。

------

