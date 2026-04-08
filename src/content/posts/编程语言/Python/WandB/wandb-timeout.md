---
title: WandB 超时问题解决
published: 2026-02-05T00:00:00.000Z
tags:
  - WandB
  - 疑难杂症
category: 编程语言/Python
description: 解决 WandB 连接超时问题，通过设置代理 BASE_URL
---

## 解决方法

```python
os.environ["WANDB_BASE_URL"] = "https://api.bandw.top"
```
