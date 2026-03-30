---
title: CUDA 驱动与 Toolkit 版本关系详解
published: 2026-02-05
tags:
  - CUDA
  - PyTorch
  - 版本兼容
category:
  - 成长日记
  - 深度学习
  - 环境配置
description: 理清 NVIDIA 驱动、CUDA Toolkit、PyTorch CUDA 运行时三者的关系与版本选择
---

简明说法：有三样东西，别混了——

1. **NVIDIA 驱动**（`nvidia-smi` 里 "Driver Version 535.113.01 / CUDA Version 12.2"）：决定你*最多*能跑到哪个 CUDA 运行时；新驱动向下兼容老 CUDA。
2. **CUDA Toolkit**（`nvcc -V` 显示 11.1）：包含编译器 `nvcc`，只在你**需要编译 CUDA 扩展**（自定义算子、部分 mmcv/mmdet ops）时才用得到。
3. **PyTorch 的 CUDA 运行时**（比如 `torch==1.10.1+cu111`）：轮子自带 cudart/cuBLAS/cuDNN/NCCL，不依赖系统 CUDA Toolkit 去"运行"模型。

它们的关系/要点：

- **运行只看驱动是否够新**：装 `+cu111` 的 PyTorch 时，驱动需 ≥ R455；你现在是 **535**，完全 OK。
- **编译扩展才看 nvcc**：要编 mmcv/mmdet 的 CUDA 扩展，**建议 nvcc 版本≈`torch.version.cuda`**。装了 `+cu111` 的 PyTorch，就用 CUDA 11.1 的 nvcc 并设好 `CUDA_HOME=/usr/local/cuda-11.1`。
- **`nvidia-smi` 里的"CUDA 12.2"不是你本机 Toolkit 版本**，只是驱动支持的最高 CUDA 运行时版本号。

⚠️ 你的机器是 **RTX 4090（Ada, SM 8.9）**：

- 实践中，**PyTorch 1.10.1 + cu111 往往不支持 4090**（常见错误如 "no kernel image available for execution on the device"），因为对 Ada 的正式支持是 **CUDA 11.8 / PyTorch 1.13+** 之后才完善。

- 建议路线（更省心）：**升级到 PyTorch 2.x + cu118/ cu121**。示例（任选其一）：

  - CUDA 12.1 轮子：

    ```
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
    ```

  - 或 CUDA 11.8 轮子：

    ```
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    ```

  这样运行时自带对应 CUDA；只在**编译扩展**时才需要系统装 Toolkit（对应 12.1 或 11.8），并设置 `CUDA_HOME` 指过去。

实操检查：

```
python - <<'PY'
import torch
print("torch:", torch.__version__)
print("torch cuda runtime:", torch.version.cuda)
print("cuda available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("gpu:", torch.cuda.get_device_name(0))
PY
```

小结：

- 不编译扩展 → 只要装对 **带 CUDA 的 PyTorch 轮子** + 驱动够新即可，**不用管 nvcc**。
- 要编扩展（mmcv/mmdet 常见）→ **nvcc 版本应与 `torch.version.cuda` 对齐**。
