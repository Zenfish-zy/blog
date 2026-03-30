---
title: "pip install -e . 报错排查"
published: 2026-02-05
tags:
  - MMDetection
  - Pip
  - 安装
category:
  - 成长日记
  - 深度学习
  - MMDetection
description: "解决 MMDetection pip install -e . 安装报错问题，特别是新显卡兼容性问题"
---

确保mmcv和CUDA都装好后，以下指令报错"no module found''

```
pip install  -e .
```

尝试：

```
pip install --no-build-isolation -e .
```

若还报错，可能是50系显卡太新，导致cuda和pytorch版本太高引起的各种问题，不安装可编辑版本

```
pip install --no-build-isolation .
```

之后每次修改**mmdetection/mmdet**下的代码后需要再次运行此代码
