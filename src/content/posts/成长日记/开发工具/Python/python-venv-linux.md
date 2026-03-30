---
title: Linux 虚拟环境运行 Python
published: 2026-02-05
tags:
  - Python
  - Linux
  - 虚拟环境
category:
  - 成长日记
  - 开发工具
  - Python
description: Linux 下使用 conda 或 venv 创建并激活虚拟环境运行 Python
---

在 Linux 上 **激活虚拟环境并运行 Python**，你可以按以下步骤操作：

------

### ✅ 1. 使用 `conda` 创建并激活环境

```
conda create --prefix=/home/你的路径/envs/myenv python=3.9
conda activate /home/你的路径/envs/myenv
```

激活成功后终端会出现 `(myenv)` 前缀。

------

### ✅ 2. 运行 Python 脚本或进入交互模式

- 运行某个 `.py` 文件：

```
python my_script.py
```

- 或直接进入交互模式：

```
python
```

------

### ❗️注意事项

- 如果你用的是 `venv` 创建的环境而不是 `conda`，激活方式不同：

```
# 创建虚拟环境（venv 方式）
python3 -m venv /home/你的路径/envs/myenv

# 激活虚拟环境
source /home/你的路径/envs/myenv/bin/activate
```

激活成功后同样会有前缀，使用 `python` 即可运行。
