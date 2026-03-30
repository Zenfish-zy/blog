---
title: Twilight 主题更新教程
published: 2026-02-05
updated: 2026-02-05
description: 记录 Twilight Astro 博客主题的更新流程，包括备份、更新、恢复个人数据和重新应用自定义修改。含实际踩坑记录。
tags:
  - Twilight
  - Astro
  - 主题更新
category:
  - 博客搭建
  - Twilight
draft: false
---

## 前言

Twilight 是一个基于 Astro 的博客主题，作者会不定期发布新版本。由于主题模板会涉及源码级别的自定义修改，直接 `git pull` 可能会导致冲突。本文记录一套稳妥的更新流程，确保个人数据不丢失，自定义修改能顺利恢复。

> **本文基于 2026-02-05 的实际更新经历编写，包含踩坑记录和解决方案。**

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

> ⚠️ **重要：以下清单比作者官方指引更完整**，包含了实际更新中容易遗漏的文件。

| 内容 | 路径 | 备注 |
|:---|:---|:---|
| 文章内容 | `src/content/` | 作者提到 ✓ |
| 静态资源 | `public/assets/` | 作者提到 ✓ |
| 看板娘资源 | `public/pio/` | 作者提到 ✓ |
| 相册配置 | `public/albums/` | 作者提到 ✓ |
| CMS 配置 | `public/admin/config.yml` | 作者提到 ✓ |
| 站点配置 | `twilight.config.yaml` | 作者提到 ✓ |
| 自定义脚注 | `FooterConfig.html` | 作者提到 ✓ |
| **GitHub Actions** | `.github/workflows/` | ⚠️ **作者未提到，必须保留！** |
| **构建配置** | `astro.config.mjs` | ⚠️ **含 base 路径，子目录部署必须！** |
| **部署脚本** | `deploy.bat`, `backup.bat` | ⚠️ **作者未提到** |
| **修改备忘录** | `CUSTOM_CHANGES.md` | ⚠️ **作者未提到** |
| **仓库说明** | `README.md` | ⚠️ **作者未提到，容易被覆盖！** |

## 更新流程

### 方案：临时目录法（推荐）

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

# PowerShell: 删除所有非 .git 的文件和目录
Get-ChildItem -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
```

或者手动删除（保留 `.git` 文件夹）。

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
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\assets\*" -Destination "E:\Tools\blog\Twilight\public\assets\" -Recurse -Force

# 恢复看板娘（如有）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\pio\*" -Destination "E:\Tools\blog\Twilight\public\pio\" -Recurse -Force

# 恢复相册（如有）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\albums\*" -Destination "E:\Tools\blog\Twilight\public\albums\" -Recurse -Force

# 恢复 CMS 配置（如有）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\public\admin\config.yml" -Destination "E:\Tools\blog\Twilight\public\admin\" -Force
```

#### 步骤 5：恢复作者未提及的重要文件 ⚠️

```powershell
# 恢复 GitHub Actions 工作流（非常重要！）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\.github" -Destination "E:\Tools\blog\Twilight\" -Recurse -Force

# 恢复 astro.config.mjs（含 base 路径配置，子目录部署必须！）
Copy-Item -Path "E:\Tools\blog\Twilight-backup\astro.config.mjs" -Destination "E:\Tools\blog\Twilight\" -Force

# 恢复部署和备份脚本
Copy-Item -Path "E:\Tools\blog\Twilight-backup\deploy.bat" -Destination "E:\Tools\blog\Twilight\" -Force
Copy-Item -Path "E:\Tools\blog\Twilight-backup\backup.bat" -Destination "E:\Tools\blog\Twilight\" -Force

# 恢复自定义修改备忘录
Copy-Item -Path "E:\Tools\blog\Twilight-backup\CUSTOM_CHANGES.md" -Destination "E:\Tools\blog\Twilight\" -Force

# 恢复 README
Copy-Item -Path "E:\Tools\blog\Twilight-backup\README.md" -Destination "E:\Tools\blog\Twilight\" -Force
```

> ⚠️ **特别注意 `astro.config.mjs`**：如果直接恢复旧文件，新版的配置变更（如新增插件）会丢失。更好的做法是**对比新旧 `astro.config.mjs`**，只将 `base: "/blog/"` 等个人配置改回来，保留新版其他配置。

> 💡 如果忘记备份 `.github/workflows/deploy.yml`，可以从 git 历史恢复：
> ```bash
> git show HEAD~1:.github/workflows/deploy.yml > .github/workflows/deploy.yml
> ```

#### 步骤 6：清理临时目录

```powershell
Remove-Item -Recurse -Force "E:\Tools\blog\Twilight-new"
```

## 重新应用自定义修改

根据 `CUSTOM_CHANGES.md` 中记录的修改，逐项应用。以下是我的自定义修改：

### 1. 页面宽度调整

文件：`src/constants/constants.ts`

```typescript
// 将 PAGE_WIDTH 从 90 改为 100
export const PAGE_WIDTH = 100;
```

### 2. 音乐播放器可见性暂停

文件：`src/components/musicPlayer.svelte`

切换标签页或最小化时自动暂停播放，回来后恢复。

详细修改：
1. 在 `showError` 状态后添加 `wasPlayingBeforeHidden` 变量
2. 在 `STORAGE_KEYS` 后添加 `handleVisibilityChange()` 函数
3. 在 `onMount` 的 `handleAudioEvents();` 后添加：`document.addEventListener("visibilitychange", handleVisibilityChange);`
4. 在 `onDestroy` 中添加：`document.removeEventListener("visibilitychange", handleVisibilityChange);`

### 3. 今日诗词

文件：`src/components/common/typewriterText.astro` 和 `src/components/banner.astro`

在 Banner 副标题中显示今日诗词 API 的内容。

详细修改：
1. `typewriterText.astro`：
   - Props 新增 `jinrishici?: boolean`
   - span 添加 `data-jinrishici` 属性
   - TypewriterEffect 类添加异步加载 `https://v2.jinrishici.com/one.json` 的逻辑
   - 修复初始化时机：使用 `astro:after-swap` 替代 `swup:contentReplaced`
2. `banner.astro`：TypewriterText 组件添加 `jinrishici={true}`

### 4. 子目录部署修复（如需要）

如果博客部署在子目录（如 `/blog/`），需要修复硬编码路径：

- `astro.config.mjs`: 设置 `base: "/blog/"`
- `src/layouts/base.astro`: Pio 样式路径
- `src/components/pio.svelte`: Pio 脚本和模型路径
- `src/utils/particle.ts`: 粒子特效图片路径

将硬编码的 `/xxx` 改为 `` `${import.meta.env.BASE_URL}xxx` ``。

## 实际踩坑记录 🔥

以下是我在 2026-02-05 更新时实际遇到的问题：

### 问题 1：GitHub Actions 工作流丢失

**现象**：部署时发现本地在跑 `pnpm build`，而不是交给 GitHub Actions。

**原因**：新主题不包含 `.github/workflows/deploy.yml`（因为每个人部署方式不同），更新时被删除了。

**解决**：
1. 从备份恢复 `.github/workflows/` 目录
2. 或从 git 历史恢复：`git show HEAD~1:.github/workflows/deploy.yml`
3. 修改 `deploy.bat`，移除本地 build 步骤

### 问题 2：Duplicate id 警告

**现象**：`pnpm dev` 时出现警告：
```
[WARN] [glob-loader] Duplicate id "成长日记/深度学习/pytorch" found in ...
```

**原因**：Astro 内容缓存残留。

**解决**：清理 `.astro` 缓存目录后重启：
```bash
rm -rf .astro
pnpm dev
```

### 问题 3：代码块语言标识符警告

**现象**：构建时出现大量警告：
```
[WARN] Received unknown language "Bash"
[WARN] Received unknown language "TOML"
```

**原因**：Markdown 中的代码块语言标识符使用了大写（如 ` ```Bash `），但 `astro-expressive-code` 要求小写。

**解决**：批量替换所有文章中的语言标识符：
- `Bash` → `bash`
- `TOML` → `toml`
- `Plain` → `text`
- `PowerShell` → `powershell`

### 问题 4：公告链接 404

**现象**：点击侧边栏公告的"Learn More"链接，返回 404。

**原因**：`twilight.config.yaml` 中公告链接是 `/blog/about/`，但 `astro.config.mjs` 的 `base` 配置是 `/`。

**解决**：
- 如果 `base: "/"`，链接应该是 `/about/`
- 如果 `base: "/blog/"`，链接应该是 `/blog/about/`

确保 `twilight.config.yaml` 中的 `siteURL` 和 `astro.config.mjs` 中的 `base` 配置一致。

### 问题 5：deploy.bat 脚本逻辑错误

**现象**：deploy.bat 在本地执行 `pnpm build`，但实际应该交给 GitHub Actions 构建。

**原因**：之前创建脚本时没意识到有 GitHub Actions 工作流。

**解决**：修改 deploy.bat，只保留 `git add` → `git commit` → `git push` 三步，构建交给云端。

### 问题 6：base 路径导致网站卡死 loading 🔥🔥🔥

**现象**：部署后网站一直停在 loading 页面，无法进入。

**原因**：博客部署在 `zenfish-zy.github.io/blog/`（子目录），但新主题默认 `base: "/"`。所有 JS/CSS 资源路径指向 `/_astro/xxx.js`（根目录），而实际应该指向 `/blog/_astro/xxx.js`，导致全部资源 404。只有 HTML 能加载，所以 loading 页面显示了但 JS 永远不会执行。

**解决**：在 `astro.config.mjs` 中设置 `base: "/blog/"`。

> ⚠️ **这不是可选的美化配置，而是子目录部署的必要条件！** 如果仓库名不是 `<username>.github.io`，GitHub Pages 会在 `/<repo-name>/` 子目录下提供服务，必须设置 `base` 匹配。

### 问题 7：README.md 被覆盖

**现象**：GitHub 仓库的 README 变成了主题作者的介绍。

**原因**：新主题自带 README.md，覆盖了个人 README。

**解决**：从 git 历史恢复：
```bash
git show HEAD~1:README.md > README.md
```

### 问题 8：旧版相册配置残留

**现象**：构建时报错 `Image file not found: src/content/albums/智子_ASK.jpg`。

**原因**：备份恢复时，旧版的 `src/content/albums/example.json` 和新版的 `src/content/albums/example/jsonExample.json` 共存了。新版相册结构变成了子文件夹形式，旧版配置引用的路径已失效。

**解决**：删除旧版 `src/content/albums/example.json`，保留新版 `example/` 子文件夹。

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

### 3. 检查清单

- [ ] 首页正常显示，Banner 有今日诗词
- [ ] 切换标签页时音乐自动暂停
- [ ] 文章页面宽度符合预期
- [ ] 代码块无语言标识符警告
- [ ] 侧边栏公告链接可正常跳转
- [ ] 分类筛选功能正常

### 4. 验证自定义修改

```bash
# 验证页面宽度
grep -n "PAGE_WIDTH" src/constants/constants.ts

# 验证音乐播放器可见性暂停
grep -n "visibilitychange" src/components/musicPlayer.svelte

# 验证今日诗词
grep -n "jinrishici" src/components/common/typewriterText.astro
grep -n "jinrishici" src/components/banner.astro

# 验证 GitHub Actions 存在
ls .github/workflows/
```

## 总结

主题更新的核心思路：

1. **备份** — 备份整个项目（包括作者未提及的 `.github/`、脚本、备忘录）
2. **保留 .git** — 保持版本控制历史
3. **覆盖代码** — 用新主题代码覆盖旧代码
4. **恢复数据** — 从备份恢复所有个人数据
5. **重新修改** — 根据 `CUSTOM_CHANGES.md` 重新应用自定义修改
6. **验证测试** — 启动开发服务器，逐项确认

### 与作者指引的主要差异

| 项目 | 作者指引 | 实际需要 |
|:---|:---|:---|
| `.github/workflows/` | 未提及 | ⚠️ **必须保留**，否则部署失败 |
| `astro.config.mjs` 的 `base` | 未提及 | ⚠️ **子目录部署必须设置**，否则资源全部 404 |
| `deploy.bat` / `backup.bat` | 未提及 | 需要保留或重建 |
| `CUSTOM_CHANGES.md` | 未提及 | 强烈建议保留 |
| `README.md` | 未提及 | ⚠️ 容易被新主题覆盖，需要恢复 |
| 代码块语言大小写 | 未提及 | 需要全部小写 |
| 旧版 albums 配置 | 未提及 | ⚠️ 需要删除，新版使用子文件夹结构 |

### 建议

1. 每次做源码修改时，及时更新 `CUSTOM_CHANGES.md`
2. `backup.bat` 脚本应该备份所有重要文件（包括脚本自身和 README）
3. 更新前先检查 `.github/workflows/` 是否存在
4. **子目录部署务必检查 `base` 配置**，这是最容易导致网站无法访问的问题
5. 恢复备份后，建议对比新旧 `astro.config.mjs`，只保留个人配置（如 `base`），其他保持新版

---

*最后更新: 2026-02-05*
