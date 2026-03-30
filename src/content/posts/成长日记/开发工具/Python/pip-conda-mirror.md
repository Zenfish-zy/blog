---
title: Pip 与 Conda 国内换源指南
published: 2026-02-05
tags:
  - Python
  - Pip
  - Conda
  - 镜像源
category:
  - 成长日记
  - 开发工具
  - Python
description: pip 和 conda 临时/永久换源为清华、阿里、腾讯等国内镜像的完整命令速查
---

# pip

## 1.临时换源：

### 清华源

```bash
pip install xxxx -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 阿里源

```bash
pip install xxxx -i https://mirrors.aliyun.com/pypi/simple/
```

### 腾讯源

```bash
pip install xxxx -i http://mirrors.cloud.tencent.com/pypi/simple
```

### 豆瓣源

```bash
pip install xxxx -i http://pypi.douban.com/simple/
```

**将xxxx换成需要安装的包的名字**

## 2.永久换源：

### 清华源

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### 阿里源

```bash
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

### 腾讯源

```bash
pip config set global.index-url http://mirrors.cloud.tencent.com/pypi/simple
```

### 豆瓣源

```bash
pip config set global.index-url http://pypi.douban.com/simple/
```

## 3.换回默认源

```bash
pip config unset global.index-url
```

---

# conda

## 1.临时换源：

```bash
conda install 包名 -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
```

## 2.永久换源：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes
```

### 验证命令：

```bash
conda config --show channels
```

看到输出里有`tsinghua`字样就说明换源成功啦！

### 常见翻车现场急救指南

#### 问题1：换源后还是下载慢？

试试清理缓存大法：

```bash
conda clean -i
```

#### 问题2：某些包找不到怎么办？

临时切回默认源试试：

```bash
conda install -c defaults 包名
```

#### 问题3：想换其他镜像源？

- 中科大源：`https://mirrors.ustc.edu.cn/anaconda/pkgs/main/`
- 阿里云源：`https://mirrors.aliyun.com/anaconda/pkgs/main/`

### 高级玩家必备技巧

```bash
# 查看当前所有镜像源
conda config --get channels

# 删除指定镜像源
conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/

# 恢复默认设置
conda config --remove-key channels
```

### 避坑指南

- 不要同时添加多个镜像源！（会引发依赖冲突）
- 遇到SSL证书错误时，试试 `conda update conda`
- 安装特定版本时建议指定channel：`conda install pytorch==1.7.1 -c pytorch`
