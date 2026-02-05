---
title: "WandB 离线模式数据上传"
published: 2026-02-05
tags: [WandB, 实验管理]
category: 成长日记
description: "WandB 离线模式下如何同步实验数据到云端"
---

## 1. 检查离线数据位置

查找 wandb 离线数据目录

```bash
find . -name "wandb" -type d
```

通常在 algorithms/ 目录下会有 wandb/ 文件夹

```bash
ls -la algorithms/wandb/
```

## 2. 同步离线数据到 WANDB 云端

进入包含 wandb 目录的位置

```bash
cd algorithms/
```

同步所有离线运行

```bash
wandb sync wandb/
```

或者同步特定运行

```bash
wandb sync wandb/offline-run-20240929_113849-abcd1234/
```

## 3. 验证上传

访问 https://wandb.ai/your-username/ur5e-rl 查看上传的实验数据。
