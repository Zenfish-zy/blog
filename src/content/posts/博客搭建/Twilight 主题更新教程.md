---
title: Twilight 主题更新教程
published: 2026-02-05
updated: 2026-02-05
description: 记录 Twilight Astro 博客主题的更新流程，包括备份、更新、恢复个人数据和重新应用自定义修改
tags:
  - Twilight
  - Astro
  - 博客
  - 主题更新
category: 博客搭建
draft: false
---

## 前言

Twilight 是一个基于 Astro 的博客主题，作者会不定期发布新版本。由于主题模板会涉及源码级别的自定义修改，直接 `git pull` 可能会导致冲突。本文记录一套稳妥的更新流程，确保个人数据不丢失，自定义修改能顺利恢复。

## 准备工作

### 1. 备份整个项目

在更新前，务必先备份整个项目目录：

```bash
# Windows PowerShell
Copy-Item -Recurse "E:\Tools\blog\Twilight" "E:\Tools\blog\Twilight-backup"

# Linux / macOS
cp -r ~/blog/Twilight ~/blog/Twilight-backup
```

### 2. 记录自定义修改

如果你对主题源码做过修改（如页面宽度、今日诗词等），请先查阅或更新 `CUSTOM_CHANGES.md` 文件，记录所有修改点。

### 3. 确认需要保留的个人数据

根据 Twilight 作者的官方指引，以下内容是个人数据，更新时需要保留：

| 内容 | 路径 |
|:---|:---|
| 文章内容 | `src/content/` |
| 静态资源（图片、音乐等） | `public/assets/` |
| 看板娘资源 | `public/pio/` |
| 相册配置 | `public/albums/` |
| CMS 配置（如有） | `public/admin/config.yml` |
| 站点配置 | `twilight.config.yaml` |
| 自定义脚注 | `public/FooterConfig.html` |

## 更新流程

### 方案一：临时目录法（推荐）

这是最安全的方案，不会影响现有 `.git` 历史。

#### 步骤 1：克隆最新主题到临时目录

```bash
cd E:\Tools\blog
git clone https://github.com/radishzzz/astro-theme-twilight.git Twilight-new
```

#### 步骤 2：清理旧项目（保留 .git）

进入旧项目目录，删除除 `.git` 以外的所有文件：

```powershell
cd E:\Tools\blog\Twilight

# PowerShell: 列出所有非 .git 的文件和目录
Get-ChildItem -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
```

或者用更安全的方式手动删除（保留 `.git` 文件夹）。

#### 步骤 3：复制新主题代码

```powershell
# 复制新主题的所有文件（不含 .git）
Copy-Item -Path "E:\Tools\blog\Twilight-new\*" -Destination "E:\Tools\blog\Twilight" -Recurse -Exclude ".git"
```

#### 步骤 4：恢复个人数据

从备份中恢复个人数据：

```powershell
# 恢复文章内容
Copy-Item -Path "E:\Tools\blog\Twilight-backup\src\content\*" -Destination "E:\Tools\blog\Twilight\src\content\" -Recurse -Force

# 恢复站点配置
Copy-Item -Path "E:\Tools\blog\Twilight-backup\twilight.config.yaml" -Destination "E:\Tools\blog\Twilight\" -Force

# 恢复静态资源
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\assets\images\*" -Destination "E:\Tools\blog\Twilight\public\assets\images\" -Recurse -Force
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\assets\music\*" -Destination "E:\Tools\blog\Twilight\public\assets\music\" -Recurse -Force

# 恢复看板娘（如有）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\pio\*" -Destination "E:\Tools\blog\Twilight\public\pio\" -Recurse -Force

# 恢复相册（如有）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\albums\*" -Destination "E:\Tools\blog\Twilight\public\albums\" -Recurse -Force

# 恢复 CMS 配置（如有）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\admin\config.yml" -Destination "E:\Tools\blog\Twilight\public\admin\" -Force
```

#### 步骤 5：清理临时目录

```powershell
Remove-Item -Recurse -Force "E:\Tools\blog\Twilight-new"
```

### 方案二：直接覆盖法

如果你不关心 Git 历史，可以直接删除整个项目后重新克隆，然后手动恢复个人数据。

## 重新应用自定义修改

根据 `CUSTOM_CHANGES.md` 中记录的修改，逐项应用。以下是常见的自定义修改：

### 1. 页面宽度调整

文件：`src/constants/constants.ts`

```typescript
// 将 PAGE_WIDTH 从 90 改为 100
export const PAGE_WIDTH = 100;
```

### 2. 音乐播放器可见性暂停

文件：`src/components/musicPlayer.svelte`

切换标签页或最小化时自动暂停播放，回来后恢复。

详细修改步骤：
1. 在 `showError` 状态后添加 `wasPlayingBeforeHidden` 变量
2. 添加 `handleVisibilityChange()` 函数
3. 在 `onMount` 中注册 `visibilitychange` 事件监听
4. 在 `onDestroy` 中移除监听器

### 3. 今日诗词

文件：`src/components/common/typewriterText.astro` 和 `src/components/banner.astro`

在 Banner 副标题中显示今日诗词 API 的内容。

详细修改步骤：
1. `typewriterText.astro` 添加 `jinrishici` prop
2. 添加异步加载 `https://v2.jinrishici.com/one.json` 的逻辑
3. 修复初始化时机（使用 `astro:after-swap` 替代 `swup:contentReplaced`）
4. `banner.astro` 中传递 `jinrishici={true}`

### 4. 子目录部署修复（如需要）

如果你的博客部署在子目录（如 `/blog/`），需要修复以下文件中的硬编码路径：

- `astro.config.mjs`: 设置 `base: "/blog/"`
- `src/layouts/base.astro`: Pio 样式路径
- `src/components/pio.svelte`: Pio 脚本和模型路径
- `src/utils/particle.ts`: 粒子特效图片路径
- `src/components/musicPlayer.svelte`: 默认封面路径

将硬编码的 `/xxx` 改为 `` `${import.meta.env.BASE_URL}xxx` ``。

## 验证与调试

### 1. 安装依赖

```bash
cd E:\Tools\blog\Twilight
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 检查常见问题

- **代码块语言警告**：确保 Markdown 中的代码块语言标识符使用小写（`bash` 而非 `Bash`）
- **打字机效果不工作**：检查 `typewriterText.astro` 的初始化时机是否正确
- **今日诗词不显示**：检查浏览器控制台是否有 CORS 或网络错误
- **音乐播放器问题**：检查 `musicPlayer.svelte` 的事件监听是否正确注册

### 4. 验证自定义修改

```bash
# 验证页面宽度
grep -n "PAGE_WIDTH" src/constants/constants.ts

# 验证音乐播放器可见性暂停
grep -n "visibilitychange" src/components/musicPlayer.svelte

# 验证今日诗词
grep -n "jinrishici" src/components/common/typewriterText.astro
grep -n "jinrishici" src/components/banner.astro
```

## 总结

主题更新的核心思路是：

1. **备份** — 备份整个项目，以防万一
2. **保留 .git** — 保持版本控制历史
3. **覆盖代码** — 用新主题代码覆盖旧代码
4. **恢复数据** — 从备份恢复个人数据（文章、配置、资源）
5. **重新修改** — 根据 `CUSTOM_CHANGES.md` 重新应用自定义修改
6. **验证测试** — 启动开发服务器，确认一切正常

建议每次做源码修改时，及时更新 `CUSTOM_CHANGES.md`，这样下次更新主题时就不会遗漏。

---

*最后更新: 2026-02-05*
