---
title: "Conda 指定虚拟环境路径（Home空间不足）"
published: 2026-02-05
tags:
  - Python
  - Conda
  - 路径迁移
category:
  - 成长日记
  - 编程语言
  - Python
description: "当 Home 目录空间不足时，如何指定 Conda 虚拟环境和缓存的安装位置"
---

## 创建虚拟环境

```
conda create --prefix=/home/jqr/DATA/pzy/envs/DMP python=3.9
```

## 激活环境

```bash
conda activate /home/jqr/DATA/pzy/envs/DMP
```

这样只是改变了环境的位置，包的安装缓存位置还是默认。

机制：conda先把包安装在缓存位置然后复制去环境中的位置

下面这个就是修改缓存位置的，jqr缓存位置在home/anaconda3，byd位置不够了

```
CONDA_PKGS_DIRS=/home/jqr/DATA/pzy/conda_pkgs conda install numpy
```



下面不用管，没啥用纯纯收集的小爱好

---

---

## pip指定安装位置

你可以使用 `--prefix` 或 `--target` 安装到你指定的位置：

### 方式一：使用 `--target` 指定包安装路径（推荐给你）

```
pip install --target=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages numpy
```

这会把 `numpy` 安装到你指定的 `site-packages` 目录中，**不会写入系统默认路径**。

> 注意：使用 `--target` 安装的包不会自动添加到 `sys.path`，所以你需要在代码里加一句：
>
> ```
> python复制编辑import sys
> sys.path.append('/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages')
> ```

------

## 目标 2：改变临时缓存目录（防止 `.cache/pip` 写满 HOME）

你还可以指定 pip 的缓存目录（临时下载 `.whl` 包的位置）：

```
pip install numpy --cache-dir=/home/jqr/DATA/pzy/pip_cache
```

可与上面组合使用：

```
pip install --target=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages \
            --cache-dir=/home/jqr/DATA/pzy/pip_cache \
            numpy
```

------

##  一次性安装多个包示例

```
pip install --target=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages \
            --cache-dir=/home/jqr/DATA/pzy/pip_cache \
            numpy pandas matplotlib
```

------

##  pip 脚本简化版（可选）

你可以写个脚本 `pip_install.sh`：

```
#!/bin/bash
pip install --target=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages \
            --cache-dir=/home/jqr/DATA/pzy/pip_cache "$@"
```

以后就可以像这样安装：

```
bash pip_install.sh numpy
```

------

如你还想让 Python 启动时自动加载这个路径，我也可以教你设置环境变量 `PYTHONPATH`。需要的话直接告诉我。



##### 您说：



这会把 `numpy` 安装到你指定的 `site-packages` 目录中，**不会写入系统默认路径**。 > 注意：使用 `--target` 安装的包不会自动添加到 `sys.path`，所以你需要在代码里加一句： >  > python >  > 复制编辑 >  > `import sys sys.path.append('/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages')`

如果我不想这样怎么办



###### ChatGPT 说：

如果你**不想手动在每个 Python 文件中添加**这句：

```
import sys
sys.path.append('/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages')
```

那你可以用以下**更自动化的办法**解决，达到"像正常 pip 安装一样可以 import"的效果：

------

### 方法一：设置 `PYTHONPATH` 环境变量（推荐）

在你的 `.bashrc` 或终端里加入这一行：

```

export PYTHONPATH=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages:$PYTHONPATH
```

然后执行：

```
source ~/.bashrc
```

或者只临时生效一次：

```
export PYTHONPATH=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages:$PYTHONPATH
```

这样你 **以后运行 Python 时就会自动搜索该路径下的包**，不需要每次 `sys.path.append(...)`。

------

### 方法二：写一个 sitecustomize.py（更高级）

在你指定的 `site-packages` 下新建一个文件：
 `/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages/sitecustomize.py`

内容如下：

```
import sys
path = '/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages'
if path not in sys.path:
    sys.path.insert(0, path)
```

Python 会在启动时自动运行这个文件，只要它在 `sys.path` 中（而你已经用 pip 装到了那里）。

------

### 方法三：在 `python` 启动命令中指定路径（一次性）

```
PYTHONPATH=/home/jqr/DATA/pzy/envs/DMP/lib/python3.9/site-packages python myscript.py
```

------

### 小结

| 方法                             | 是否推荐     | 说明                 |
| -------------------------------- | ------------ | -------------------- |
| 修改 `.bashrc` 设置 `PYTHONPATH` | 推荐       | 最简单、全局自动生效 |
| 使用 `sitecustomize.py`          | 推荐       | 自动、对开发更友好   |
| 每次写 `sys.path.append(...)`    | 繁琐       | 容易忘记或冗余       |
| 命令行加 `PYTHONPATH=...`        | 方便调试用 | 一次性手动生效       |
