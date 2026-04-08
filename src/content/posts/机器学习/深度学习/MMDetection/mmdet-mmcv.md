---
title: MMCV 安装问题排查
published: 2026-02-05T00:00:00.000Z
tags:
  - MMCV
  - MMDetection
  - 安装
category: 机器学习/深度学习/MMDetection
description: 解决 MMCV 安装中的 no module named 'mmcv._ext' 等问题，手动编译 MMCV 指南
---

因为会遇到no module named 'mmcv._ext'等问题

可能需要选择手动编译mmcv

### Build on Linux

1. Clone the repo-克隆项目或者手动去[github项目](https://github.com/open-mmlab/mmcv/releases/tag/v2.2.0)下载压缩包并改名mmcv(注意版本，选择2.1.0或者2.2.0)

   ```
   git clone https://github.com/open-mmlab/mmcv.git
   cd mmcv
   ```



2. Install `ninja` and `psutil` to speed up the compilation

   ```
   pip install -r requirements/optional.txt
   ```



3. Check the nvcc version (requires 9.2+. Skip if no GPU available.)

   ```
   nvcc --version
   ```



   If the above command outputs the following message, it means that the nvcc setting is OK, otherwise you need to set CUDA_HOME.

   ```
   nvcc: NVIDIA (R) Cuda compiler driver
   Copyright (c) 2005-2020 NVIDIA Corporation
   Built on Mon_Nov_30_19:08:53_PST_2020
   Cuda compilation tools, release 11.2, V11.2.67
   Build cuda_11.2.r11.2/compiler.29373293_0
   ```



   Note

   If you want to support ROCm, you can refer to [AMD ROCm](https://rocmdocs.amd.com/en/latest/Installation_Guide/Installation-Guide.html) to install ROCm.

4. Check the gcc version (requires 5.4+)

   ```
   gcc --version
   ```



5. Start building (takes 10+ min)

   ```
   pip install -e .
   如果这样后显示安装成功但是第6步验证时出现no module的报错，首先检查cuda环境变量是否完全正确，然后执行下面这行指令
   MMCV_WITH_OPS=1 FORCE_CUDA=1 pip install . --no-build-isolation -v
   ```



6. Validate the installation

   ```
   python .dev_scripts/check_installation.py
   ```
