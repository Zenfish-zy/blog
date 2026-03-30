---
title: "MMDetection 注册表 KeyError 排查"
published: 2026-02-05
tags:
  - MMDetection
  - 注册表
  - 疑难杂症
category:
  - 成长日记
  - 深度学习
  - MMDetection
description: "解决 MMDetection 自定义模型注册表 KeyError 问题，使用 custom_imports 正确导入自定义模块"
---

# 问题

即便是上传代码且运行一下指令安装后：

```bash
pip install --no-build-isolation . --force-reinstall --no-deps
```

也报错：

KeyError: 'YOLA_Transformer is not in the mmdet::model registry. Please check whether the value of `YOLA_Transformer` is correct or it was registered as expected. More details can be found at https://mmengine.readthedocs.io/en/latest/advanced_tutorials/config.html#import-the-custom-module'

![image-20260117090247687](./image-20260117090247687.png)

# 解决方案

```
在配置文件添加 MMDetection 官方推荐的 custom_imports，而不修改mmdet：
  # 自定义模块导入（MMDetection 官方推荐方式）
  custom_imports = dict(
      imports=['mmdet.models.detectors.yola_wavelet'],
      allow_failed_imports=False
  )
```



# 参考链接

## [MMDetection官方文档](https://mmdetection.cn/en/latest/get_started.html)

### [自定义模型与配置文件](https://mmdetection.readthedocs.io/zh-cn/latest/advanced_guides)
