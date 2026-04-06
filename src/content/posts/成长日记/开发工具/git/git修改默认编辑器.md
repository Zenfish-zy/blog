---
title: git修改默认编辑器
published: 2026-02-05
tags:
  - Git
  - 编辑器
category:
  - 成长日记
  - 开发工具
  - Git
description: Git 配置系统详解，包括如何修改默认编辑器为 VSCode 或 Notepad++
---
# Git 配置系统教程

## 概述

Git 的流行度无需赘述，但关于 Git 的配置系统，你真的掌握了吗？遇到问题时，多数人只是百度一顿猛搜，然后复制粘贴一堆自己都不明白的命令，最后不仅问题未解，还把自己整得筋疲力尽。

今天我们就来聊聊 Git 的配置系统。你将不再盲目执行命令，而是理解它们背后的原理，做到"授人以渔"。

------

## Git 的配置系统层次

Git 的配置系统分为三个层级，优先级从外到内依次为：

- `system`
- `global`
- `local`

配置生效顺序如下图所示（想象同心圆，越内层优先级越高）：

1. Git 会首先检查 **local（当前仓库）**
2. 若未配置，则检查 **global（当前用户）**
3. 仍无配置，最后检查 **system（系统级别）**

------

### 配置级别解释

#### Local

- **作用范围**：仅当前代码仓库
- **配置文件路径**：`.git/config`

**应用场景举例**：

> 家里电脑使用 VPN 向公司项目提交代码时，希望显示工作名称 `Ben` 而不是默认用户名 `shusheng007`，可为该项目单独设置用户名。

------

#### Global

- **作用范围**：当前系统用户
- **配置文件路径**：`~/.gitconfig`（Windows 通常为 `C:/Users/用户名/.gitconfig`）

**应用场景举例**：

> 不同用户账户可配置不同的 Git 用户名，如 admin 配置为 admin，shusheng007 配置为 shusheng007。

------

#### System

- **作用范围**：整台机器，影响所有用户
- **配置文件路径**：`Git安装路径/etc/gitconfig`

------

## Git 配置文件的格式

一个典型的配置文件如下所示：

```
[http]
    sslBackend = openssl
    sslCAInfo = xxxxxx/Git/mingw64/ssl/certs/ca-bundle.crt

[core]
    autocrlf = true
    fscache = true
    symlinks = false

[user]
    name = shusheng007
    email = xxxx
```

------

## 如何查看 Git 配置

### 查看全部配置项及其来源

```
git config --list --show-origin
```

输出示例（已按配置级别注释）：

```
file:D:/Git/etc/gitconfig   # system
file:C:/Users/Admin/.gitconfig  user.name=shusheng007  # global
file:.git/config            core.repositoryformatversion=0  # local
```

------

### 查看单项配置值

```
git config user.name
```

------

## 如何设置 Git 配置

### 方法一：编辑配置文件

直接打开相应配置文件手动编辑：

```
git config --global --edit
```

也可以使用 `--local` 或 `--system` 替换 `--global`。

------

### 方法二：使用命令配置

设置 global 用户名：

```
git config --global user.name shusheng007
```

移除 global 用户名：

```
git config --global --unset user.name
```

移除整个 `[user]` 部分：

```
git config --global --remove-section user
```

------

## 配置 Git 默认编辑器为 VSCode

Git 默认编辑器是 Vim，但对不熟悉命令行的 Windows 用户来说非常不友好。我们可以将编辑器换成 VSCode：

### 配置步骤：

1. 确保已安装 VSCode 且配置环境变量
2. 设置编辑器：

```
git config --global core.editor "code --wait"
```

若希望每次打开新窗口：

```
git config --global core.editor "code --wait --new-window"
```

恢复默认 Vim：

```
git config --global --unset core.editor
```

也可直接修改配置文件：

```
editor = code --wait
```

------

## 配置 Git 的 difftool 与 mergetool 为 VSCode

编辑配置文件：

```
git config --global --edit
```

粘贴以下内容：

```
[diff]
    tool = vscode-diff

[difftool]
    prompt = false

[difftool "vscode-diff"]
    cmd = code --wait --diff $LOCAL $REMOTE

[merge]
    tool = vscode-merge

[mergetool "vscode-merge"]
    cmd = code --wait $MERGED
```

------

## 配置 Git 默认编辑器为 Notepad++

### 步骤：

1. 安装 Notepad++
2. 执行命令：

```
git config --local core.editor "'D:/Program Files (x86)/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

**说明**：

- `--local` 表示只对当前仓库生效
- 参数含义：
  - `-multiInst`：多开新窗口
  - `-notabbar`：不显示标签栏
  - `-nosession`：不加载上次会话
  - `-noPlugin`：不加载插件

验证编辑器：

```
git config --local --edit
```

------

## 总结

现在你应该对 Git 配置系统的三个层次（local、global、system）有了清晰的理解，也能熟练设置默认用户名、编辑器、difftool、mergetool 等参数。

当你再次查找某个 Git 设置时，就不再"懵"了。

> 写这些内容的目的不仅是分享，也是给将来的自己留一个笔记。

为我们的 IT 事业点个赞吧！愿你在编程的道路上越走越远，一路收获满满。
