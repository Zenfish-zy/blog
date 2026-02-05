---
title: PyTorch 安装指南
published: 2026-02-05
tags:
  - PyTorch
  - CUDA
  - 深度学习
category: 成长日记
description: PyTorch 历史版本安装命令及 CUDA 版本对应关系速查
---

# 历史版本 pytorch 与 安装

如果你不想安装最新版本的 pytorch ，可以在这里查看历史版本 ： https://pytorch.org/get-started/previous-versions/

你可以选择你想要的版本，根据你的系统、想要使用的安装方式、cuda 版本，等，找到对应的 安装命令

------

一般我最常用的是 （ python 3.10 + ） 【pytorch 2.1.2】 + 【pip 安装】 + 【Linux】 + 【CUDA 11.8】 ，命令为：

```Bash
pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
```

我们做 计算机视觉，一般使用不到 `torchaudio` （处理语音、音频），所以可以不安装，删除掉之后，命令为：

```Bash
pip install torch==2.1.2 torchvision==0.16.2 --index-url https://download.pytorch.org/whl/cu118
```

如果是50系显卡，需使用 12.8 版本以上的 cuda，

推荐使用 ： （ python 3.12 + ） 【pytorch 2.7.0】 + 【pip 安装】 + 【Linux】 + 【CUDA 12.8】

```Bash
pip install torch==2.7.0 torchvision==0.22.0 --index-url https://download.pytorch.org/whl/cu128
```

| **PyTorch version** | **Python**                           | **C++** | **Stable CUDA**                                          | **Experimental CUDA**       | **Stable ROCm** |
| ------------------- | ------------------------------------ | ------- | -------------------------------------------------------- | --------------------------- | --------------- |
| 2.10                | >=3.10, <=(3.14, 3.14t experimental) | C++17   | CUDA 12.6 (CUDNN 9.10.2.21), CUDA 12.8 (CUDNN 9.10.2.21) | CUDA 13.0 (CUDNN 9.13.0.50) | ROCm 7.1        |
| 2.9                 | >=3.10, <=(3.14, 3.14t experimental) | C++17   | CUDA 12.6 (CUDNN 9.10.2.21), CUDA 12.8 (CUDNN 9.10.2.21) | CUDA 13.0 (CUDNN 9.13.0.50) | ROCm 6.4        |
| 2.8                 | >=3.9, <=3.13, (3.13t experimental)  | C++17   | CUDA 12.6 (CUDNN 9.10.2.21), CUDA 12.8 (CUDNN 9.10.2.21) | CUDA 12.9 (CUDNN 9.10.2.21) | ROCm 6.4        |
| 2.7                 | >=3.9, <=3.13, (3.13t experimental)  | C++17   | CUDA 11.8 (CUDNN 9.1.0.70), CUDA 12.6 (CUDNN 9.5.1.17)   | CUDA 12.8 (CUDNN 9.7.1.26)  | ROCm 6.3        |
| 2.6                 | >=3.9, <=3.13, (3.13t experimental)  | C++17   | CUDA 11.8, CUDA 12.4 (CUDNN 9.1.0.70)                    | CUDA 12.6 (CUDNN 9.5.1.17)  | ROCm 6.2.4      |
| 2.5                 | >=3.9, <=3.12, (3.13 experimental)   | C++17   | CUDA 11.8, CUDA 12.1, CUDA 12.4, CUDNN 9.1.0.70          | None                        | ROCm 6.2        |
| 2.4                 | >=3.8, <=3.12                        | C++17   | CUDA 11.8, CUDA 12.1, CUDNN 9.1.0.70                     | CUDA 12.4, CUDNN 9.1.0.70   | ROCm 6.1        |
| 2.3                 | >=3.8, <=3.11, (3.12 experimental)   | C++17   | CUDA 11.8, CUDNN 8.7.0.84                                | CUDA 12.1, CUDNN 8.9.2.26   | ROCm 6.0        |
| 2.2                 | >=3.8, <=3.11, (3.12 experimental)   | C++17   | CUDA 11.8, CUDNN 8.7.0.84                                | CUDA 12.1, CUDNN 8.9.2.26   | ROCm 5.7        |
| 2.1                 | >=3.8, <=3.11                        | C++17   | CUDA 11.8, CUDNN 8.7.0.84                                | CUDA 12.1, CUDNN 8.9.2.26   | ROCm 5.6        |
| 2.0                 | >=3.8, <=3.11                        | C++14   | CUDA 11.7, CUDNN 8.5.0.96                                | CUDA 11.8, CUDNN 8.7.0.84   | ROCm 5.4        |
