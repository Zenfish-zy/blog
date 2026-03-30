---
title: git如何提pr
published: 2026-03-30 16:55
tags:
  - git
  - pr
category: git
description: git如何提pr
---


以下是为你扩展和丰富后的详细学习笔记，结构上做了进一步的梳理，方便你随时查阅和复习。

------

# Git 与 GitHub 开源贡献（PR）标准工作流指南

这篇笔记详细记录了参与开源项目或团队协作时，从 Fork 代码到提交 Pull Request (PR) 的完整生命周期。理解这套流程不仅能避免代码冲突，还能让你养成专业、安全的版本控制习惯。

## 一、 核心概念深度解析

理解 Git 的核心不仅是记住命令，更重要的是理解数据在不同“区域”之间的流转。

- **工作区 (Working Directory)**：你当前正在电脑上看到和修改的文件。这些是你实际在敲代码的地方。
- **暂存区 (Staging Area/Index)**：一个缓冲地带。当你执行 `git add` 时，你是在告诉 Git：“把这些特定的改动准备好，放到下一次的提交中”。这允许你精挑细选要提交的变更，而不是一股脑全塞进去。
- **本地仓库 (Local Repository - Commit)**：一次本地存档（快照）。当你执行 `git commit` 时，暂存区里的内容就被永久记录在了本地历史中。
- **分支 (Branch)**：一条独立的开发时间线。在分支上开发（如 `feat/my-change`）可以绝对保证主干（`main`）的稳定，避免代码相互污染。
- **远端仓库 (Remote)**：托管在云端（如 GitHub）的仓库。
- **推送 (Push)**：把本地的提交历史同步到远端仓库。
- **Pull Request (PR)**：GitHub 提供的一种协作机制。本质上是你向原项目的维护者发起的一个“请求”：“我做了一些修改，请审查并把我的分支合并到你的主干中”。

------

## 二、 最常见的标准贡献流程 (Standard Fork & PR Workflow)

这是参与大多数开源项目的标准做法。

## 1. 准备工作

- **Fork 原项目**：在 GitHub 页面上点击 "Fork" 按钮，把原作者的仓库复制一份到你自己的账号下。此时，你拥有了对这个副本的绝对控制权。

- **克隆到本地 (Clone)**：

  Bash

  ```
  git clone https://github.com/<你的用户名>/<仓库名>.git
  cd <仓库名>
  ```

- **关联上游仓库 (Upstream)**：为了能获取原作者的最新更新，你需要把原仓库添加为一个远端地址（通常命名为 `upstream`）。

  Bash

  ```
  git remote add upstream https://github.com/<原作者>/<仓库名>.git
  ```

## 2. 日常开发循环

- **同步上游最新代码**（非常重要，每次写新代码前必做）：

  Bash

  ```
  git fetch upstream        # 拉取原仓库最新变动
  git checkout main         # 切换回你本地的主分支
  git merge upstream/main   # 将原仓库的最新主干代码合并到你本地的主干
  git push origin main      # （可选）顺手把你 GitHub 上的 fork 也更新一下
  ```

- **新建功能分支**：永远不要在 main 上直接改代码！

  Bash

  ```
  git checkout -b feat/my-change  # 创建并立刻切换到新分支
  ```

- **编码与检查**：写完代码后，查看自己到底改了什么。

  Bash

  ```
  git status                # 看哪些文件变了
  git diff                  # 看具体改了哪些行
  ```

- **精准暂存**：千万别无脑暂存所有文件，只挑选你本次功能涉及的文件。

  Bash

  ```
  git add path/to/file1 path/to/file2
  ```

- **规范提交**：写一句清晰的提交说明，格式建议采用 `类型: 描述`。

  Bash

  ```
  git commit -m "feat: add user login API"
  ```

- **推送到你的 Fork**：

  Bash

  ```
  git push -u origin feat/my-change  # -u 参数用于首次推送并建立上下游关联
  ```

## 3. 发起合并请求

- **提交 PR**：去 GitHub 你的仓库页面，通常会弹出一个显眼的 "Compare & pull request" 绿底按钮。点击它，填写 PR 描述，提交给原作者审查。

------

## 三、 你当前项目的定制化流程

根据你当前仓库的特殊配置，命名习惯与标准流程有所不同，但逻辑是一致的：

- `origin` = 原作者仓库 (`zc-zhangchen/any-auto-register`)
- `fork` = 你自己的仓库 (`Zenfish-zy/any-auto-register`)

**针对这个项目的标准操作路径如下：**

1. **同步原作者代码**：

   Bash

   ```
   git fetch origin
   git checkout main
   git merge origin/main
   ```

2. **开启新任务分支**：

   Bash

   ```
   git checkout -b feat/xxx
   ```

3. **修改代码并检查**：

   Bash

   ```
   git status
   git diff
   ```

4. **按需添加文件**：

   Bash

   ```
   git add api/a.py frontend/src/x.tsx
   ```

5. **生成提交**：

   Bash

   ```
   git commit -m "feat: xxx"
   ```

6. **推送到你自己的仓库**：

   Bash

   ```
   git push -u fork feat/xxx
   ```

7. **打开浏览器提交 PR**：

   使用如下格式的链接进行快速对比并创建 PR：

   `https://github.com/zc-zhangchen/any-auto-register/compare/main...Zenfish-zy:any-auto-register:feat/xxx?expand=1`

------

## 四、 新手避坑指南与安全操作

Git 是一个强大的工具，但也容易让新手感到挫败。记住以下几点可以避免 90% 的惨剧。

## 🚨 绝对要避免的“死亡操作”

1. **直接在 `main` 分支上开发**：这会导致你的代码与上游主干严重耦合，后续同步时极易发生大量冲突。
2. **滥用 `git add .`**：这很容易把测试数据、本地配置文件（如 `.env`）、编译产物（如 `node_modules`）甚至密码凭证一起提交上去。
3. **“盲僧式”提交**：在不看 `git status` 确认变动文件列表的情况下直接 commit。
4. **概念混淆**：没弄清哪个是自己的 fork（有写入权限），哪个是原仓库（只有读取权限），导致 push 报错 `Permission denied`。

## 🛡️ 最佳实践与后悔药

- **提交前必看（你的安全网）**：

  Bash

  ```
  git status             # 宏观检查：改了哪些文件？哪些在暂存区？
  git diff --cached      # 微观检查：暂存区里的文件具体改了哪些代码？（非常推荐）
  ```

- **“哎呀，我加错文件了！”（从暂存区撤出文件，但不丢失改动）**：

  Bash

  ```
  git restore --staged <文件名>
  ```

- **“我写的这些代码太烂了，我想重新开始！”（丢弃工作区的未提交改动）**：

  Bash

  ```
  git restore <文件名>   # ⚠️ 危险：这个操作不可逆！执行前一定要确认这些代码你真的不要了。
  ```

## 💡 你的当前进度总结

你目前的实际操作非常标准，已经走完了前面的所有困难步骤：

1. 创建了合理的特性分支：`feat/chatgpt-cpa-backfill`
2. 成功生成了本地 Commit：`3db9d38`
3. 已经推送到你自己的 Fork 仓库。

**最后一步**：现在只需去 GitHub 页面点击 `Compare & pull request`，附带上清晰的文字说明（说明你解决了什么问题，改动了哪里），即可完成一次完美的开源贡献！