---
title: "WandB 超时问题解决"
published: 2026-02-05
tags:
  - WandB
  - 疑难杂症
category:
  - 成长日记
  - 编程语言
  - Python
  - WandB
description: "解决 WandB 连接超时问题，通过设置代理 BASE_URL"
routeName: 成长日记/开发工具/wandb/wandb-timeout
---

## 解决方法

```python
os.environ["WANDB_BASE_URL"] = "https://api.bandw.top"
```
