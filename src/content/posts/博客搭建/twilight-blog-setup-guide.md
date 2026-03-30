---
title: 从 Hexo 迁移到 Twilight：完整博客搭建教程
published: 2026-02-02 12:00
tags:
  - Hexo
  - Twilight
  - Astro
  - 迁移
category:
  - 博客搭建
  - Twilight
description: 记录从 Hexo 迁移到 Twilight 博客主题的完整过程，包括环境搭建、内容迁移、个性化配置、踩坑记录和部署到 GitHub Pages。
---

## 前言

之前一直使用 Hexo 搭建博客，但偶然发现了 [Twilight](https://github.com/Spr-Aachen/Twilight) 这个基于 Astro 的博客主题，被它精美的 UI 和丰富的功能所吸引，于是决定迁移过来。

本文记录了完整的迁移和配置过程，**包含大量实际踩坑经验**，希望对有同样需求的朋友有所帮助。

## 为什么选择 Twilight

| 特性 | Hexo | Twilight |
|:---|:---|:---|
| 框架 | Node.js | Astro + Svelte |
| 构建速度 | 较慢 | 极快 |
| UI 设计 | 依赖主题 | 现代化、响应式 |
| 动画效果 | 一般 | 丰富流畅 |
| 内置功能 | 需要插件 | 音乐播放器、看板娘、粒子特效等 |
| CMS 支持 | 无 | 集成 Decap CMS |

## 环境准备

### 1. 安装 Node.js

前往 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本并安装。

### 2. 安装 pnpm

```bash
npm install -g pnpm
```

> **踩坑提醒**：如果之前通过 Scoop 等包管理器安装了 pnpm，升级后可能出现路径冲突。建议统一使用 `npm install -g pnpm` 安装。

### 3. 克隆 Twilight 模板

```bash
git clone https://github.com/Spr-Aachen/Twilight.git
cd Twilight
pnpm install
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:4321` 即可预览。

## 从 Hexo 迁移文章

### Front Matter 格式转换

Hexo 和 Twilight 的 Front Matter 格式有所不同：

**Hexo 格式：**
```yaml
---
title: 文章标题
date: 2026-01-15 10:30:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
---
```

**Twilight 格式：**
```yaml
---
title: 文章标题
published: 2026-01-15 10:30
tags:
  - 标签1
  - 标签2
category:
  - 一级分类
  - 二级分类
description: 文章描述
---
```

主要变化：
- `date` → `published`
- `categories`（数组）→ `category`（层级数组，渲染为多级分类）
- 新增 `description` 字段

如果你已有旧文章写成 `category: 成长日记/深度学习`，Twilight 也能兼容，但更推荐统一改成数组写法：

```yaml
category:
  - 成长日记
  - 深度学习
```

### 迁移步骤

1. 将 Hexo 的 `source/_posts/` 下的 `.md` 文件复制到 Twilight 的 `src/content/posts/`
2. 批量修改 Front Matter 格式
3. 检查图片路径，确保图片正确引用

### 迁移关于页面和友链页面

Twilight 的 `about.md` 和 `friends.md` 放在 `src/content/` 目录下。

> **踩坑：Frontmatter 必须存在**
>
> 即使是空的 Frontmatter，也**必须**用 `---` 包裹，否则 Astro 的 YAML 解析器会把正文内容当作 YAML 解析，导致构建失败：
> ```
> [ERROR] end of the stream or a document separator is expected
> ```
>
> 正确写法（空 Frontmatter）：
> ```markdown
> ---
> ---
>
> 正文内容...
> ```

### 迁移友链数据

Hexo 的友链通常在 `link.yml` 中，Twilight 使用 JSON 文件：

**Hexo 格式**（`link.yml`）：
```yaml
- class_name: 友链
  flink_style: flexcard
  link_list:
    - name: Linuxdo
      link: https://linux.do/
      avatar: https://linux.do/logo-128.svg
      descr: 没有Linux
```

**Twilight 格式**（`src/content/friends/linuxdo.json`）：
```json
{
    "title": "Linuxdo",
    "imgurl": "https://linux.do/logo-128.svg",
    "desc": "没有Linux",
    "siteurl": "https://linux.do/",
    "tags": ["社区"]
}
```

每个友链一个 JSON 文件，放在 `src/content/friends/` 目录下。记得删除默认的示例友链文件。

## 个性化配置

所有配置都在 `twilight.config.yaml` 文件中。

### 基本信息

```yaml
site:
    siteURL: "https://your-username.github.io/blog/"
    title: "博客标题"
    subtitle: "博客副标题"
    lang: "zh-CN"

profile:
    avatar: "/assets/images/avatar.png"
    name: "你的名字"
    bio: "个人简介"
```

### 字体配置

默认字体对中文覆盖不全，会导致部分字符 fallback 到系统字体，看起来不统一。推荐使用**霞鹜文楷**——中文博客圈超人气的开源字体：

```yaml
site:
    font:
        "LXGW-WenKai":
            src: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
            family: "LXGW WenKai"
```

> 霞鹜文楷完整覆盖简体中文 + 繁体中文 + 日文，是手写楷体风格，温暖文艺，非常适合个人博客。通过 jsDelivr CDN 加载，国内访问速度也不错。

### 壁纸配置

```yaml
site:
    wallpaper:
        mode: "banner"  # banner | fullscreen | none
        src:
            desktop:
                - "/assets/images/wallpaper.png"
            mobile:
                - "/assets/images/wallpaper.png"
        carousel:
            enable: true
            interval: 3.6
```

> **踩坑：中文文件名**
>
> 静态资源文件名请使用**英文**，避免中文或特殊字符。中文文件名在构建/部署时可能导致路径编码问题。例如把"卡通插画-可爱小狗.png"重命名为 `cute-dogs-camping.png`。

### 音乐播放器

```yaml
musicPlayer:
    enable: true
    mode: "local"  # local | meting
    local:
        playlist:
            - id: 1
              title: "歌曲名"
              artist: "歌手"
              url: "/blog/assets/music/song.flac"
              duration: 228
    autoplay: true
```

> **踩坑：音乐路径需要 base 前缀**
>
> 如果部署在子目录（如 `/blog/`），音乐文件的 `url` 需要加上 base 路径前缀。例如文件放在 `public/assets/music/song.flac`，配置中应写 `/blog/assets/music/song.flac`。

> **踩坑：FLAC 格式**
>
> 如果使用 FLAC 格式的音乐文件，git 默认可能不识别为二进制文件。建议在 `.gitattributes` 中添加：
> ```
> *.flac binary
> ```

### 公告栏链接

```yaml
announcement:
    link:
        enable: true
        text: "Learn More"
        url: "/blog/about/"
```

> **踩坑：子目录部署时 URL 要加 base**
>
> `url` 要写完整路径 `/blog/about/` 而不是 `/about/`，否则会跳到错误的页面。

### Umami 统计

```yaml
umami:
    enabled: false  # 需要正确配置才能启用
    baseUrl: "https://api.umami.is"
    apiKey: ""
    scripts: ""
```

> **踩坑：Umami 未配置就启用会导致浏览量异常**
>
> 如果启用了 Umami 但 `apiKey` 和 `scripts` 为空，可能出现浏览量每次刷新 +10 的异常情况。如果还没配置好 Umami，请先设为 `enabled: false`。

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

在 GitHub 创建一个新仓库，例如 `blog`。

### 2. 配置 base 路径

由于部署在子目录 `/blog/`，需要修改 `astro.config.mjs`：

```javascript
export default defineConfig({
    site: 'https://your-username.github.io',
    base: '/blog/',
    // ...
});
```

同时更新 `twilight.config.yaml` 中的 `siteURL` 和音乐路径等。

### 3. 推送代码

```bash
git init
git remote add origin https://github.com/your-username/blog.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 4. 启用 GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 等待 Actions 构建完成
4. 访问 `https://your-username.github.io/blog/`

> **踩坑：首次访问 404**
>
> 如果构建成功但访问 404，检查：
> 1. Pages 的 Source 是否选的是 "GitHub Actions"（不是 "Deploy from a branch"）
> 2. `astro.config.mjs` 中的 `base` 和 `twilight.config.yaml` 中的 `siteURL` 是否一致
> 3. 等待几分钟，GitHub Pages 生效需要一点时间

## 源码级自定义修改

有些功能目前不在 `twilight.config.yaml` 中提供，需要修改源码。**这些修改在升级模板时会被覆盖，建议记录在备忘录中。**

### 1. 调整页面宽度

文件：`src/constants/constants.ts`

```typescript
// 默认 90rem，觉得太窄可以改大
export const PAGE_WIDTH = 100;
```

### 2. 音乐播放器 - 页面可见性暂停

切换标签页或最小化窗口时自动暂停，回来后恢复播放。

文件：`src/components/musicPlayer.svelte`

**添加状态变量**（在 `let showError = $state(false);` 后）：
```javascript
let wasPlayingBeforeHidden = false;
```

**添加处理函数**（在 `STORAGE_KEYS` 常量后）：
```javascript
function handleVisibilityChange() {
    if (typeof document === 'undefined' || !audio) return;
    if (document.hidden) {
        wasPlayingBeforeHidden = isPlaying;
        if (isPlaying) { audio.pause(); }
    } else {
        if (wasPlayingBeforeHidden && !isPlaying) {
            audio.play().catch(() => {});
        }
    }
}
```

**注册/注销事件监听**：
- `onMount` 中 `handleAudioEvents();` 后添加：`document.addEventListener('visibilitychange', handleVisibilityChange);`
- `onDestroy` 中添加：`document.removeEventListener('visibilitychange', handleVisibilityChange);`

### 3. 今日诗词（每日诗句）

类似 Hexo 的今日诗词插件，在 Banner 副标题中轮播显示来自[今日诗词 API](https://www.jinrishici.com/) 的随机诗句。

**文件 1**：`src/components/common/typewriterText.astro`

- Props 新增 `jinrishici?: boolean`
- span 元素新增 `data-jinrishici` 属性
- TypewriterEffect 构造函数中检测该属性，异步 fetch `https://v2.jinrishici.com/one.json`
- 将获取到的诗句添加到打字文本列表中轮播显示
- 即使 API 请求失败也不影响原有功能

**文件 2**：`src/components/banner.astro`

```astro
<TypewriterText
    text={config.banner.homeText.subtitle}
    speed={config.banner.homeText.typewriter.speed}
    deleteSpeed={config.banner.homeText.typewriter.deleteSpeed}
    pauseTime={config.banner.homeText.typewriter.pauseTime}
    jinrishici={true}
/>
```

### 4. 子目录部署路径修复（重要！）

Twilight 模板部分组件**硬编码了根路径 `/`**，在 `/blog/` 等子目录部署时会导致资源 404。需要逐一修复为 `import.meta.env.BASE_URL`。

| 文件 | 原始路径 | 修复方式 |
|:---|:---|:---|
| `src/layouts/base.astro` | `/pio/static/pio.css` | `` `${import.meta.env.BASE_URL}pio/static/pio.css` `` |
| `src/components/pio.svelte` | `/pio/static/l2d.js`、`/pio/static/pio.js` | 同上方式替换 |
| `src/components/pio.svelte` | 模型路径 `/pio/models/...` | 添加 `processModelPaths()` 函数自动处理 |
| `src/utils/particle.ts` | `/assets/images/particle.png` | `` `${import.meta.env.BASE_URL}assets/images/particle.png` `` |
| `src/components/musicPlayer.svelte` | 默认封面 `/favicon/icon-light.ico` | `` `${import.meta.env.BASE_URL}favicon/icon-light.ico` `` |

> **核心原则**：凡是硬编码的 `/xxx/...` 路径（指向 public 目录的静态资源），都需要替换为 `` `${import.meta.env.BASE_URL}xxx/...` `` 格式。在 dev server 日志中看到的 `[ERROR] [router] Request URLs for public/ assets must also include your base` 错误就是这个问题。

## Typora 插件适配

为了方便在 Typora 中快速插入 Twilight 格式的 Front Matter，可以创建自定义插件。

### 插件配置

在 Typora 插件配置文件 `custom_plugin.user.toml` 中添加：

```toml
[twilightFrontMatter]
name = "插入 Twilight Front Matter"
enable = true
hide = false
order = 2
hotkey = "ctrl+alt+t"
template = "---\ntitle: \npublished: {{datetime}}\ntags:\n  - \ncategory:\n  - \n  - \ndescription: \n---"
```

### 插件代码

创建 `twilightFrontMatter.js`：

```javascript
class TwilightFrontMatter extends BaseCustomPlugin {
    hint = () => "在文件开头插入 Twilight Front Matter 模板"
    hotkey = () => [this.config.hotkey]
    callback = async anchorNode => {
        // 检测是否已有 Front Matter
        // 生成模板并插入
        // 定位光标到 title 后
    }
}
module.exports = { plugin: TwilightFrontMatter }
```

使用快捷键 `Ctrl+Alt+T` 即可快速插入模板。

## 备份策略

### 需要备份的内容

| 内容 | 路径 | 说明 |
|:---|:---|:---|
| 静态资源 | `public/` | 头像、壁纸、音乐等 |
| 文章内容 | `src/content/` | 文章、关于、友链等 |
| 站点配置 | `twilight.config.yaml` | 所有配置项 |
| 构建配置 | `astro.config.mjs` | base 路径等 |

### 源码修改备忘

升级模板后需要重新应用的修改（详见 `CUSTOM_CHANGES.md`）：

1. `astro.config.mjs` → `base: "/blog/"`
2. `src/constants/constants.ts` → `PAGE_WIDTH = 100`
3. `src/components/musicPlayer.svelte` → 页面可见性暂停 + 默认封面路径
4. `src/components/common/typewriterText.astro` + `banner.astro` → 今日诗词
5. 子目录部署路径修复（base.astro、pio.svelte、particle.ts）

### 一键备份脚本

创建 `backup.bat`：

```batch
@echo off
chcp 65001 >nul
set BACKUP_DIR=..\Twilight-backup

echo 正在备份到 %BACKUP_DIR% ...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: 备份配置文件
copy /Y "twilight.config.yaml" "%BACKUP_DIR%\"
copy /Y "astro.config.mjs" "%BACKUP_DIR%\"

:: 备份内容和静态资源
xcopy /E /I /Y "public" "%BACKUP_DIR%\public"
xcopy /E /I /Y "src\content" "%BACKUP_DIR%\src\content"

echo 备份完成！
pause
```

## 踩坑总结

总结一下搭建过程中遇到的所有坑：

### 构建相关

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| `end of the stream or a document separator` | about.md/friends.md 缺少 Frontmatter | 添加空的 `---\n---` |
| `Duplicate id "about"/"friends"` | 同上，Frontmatter 缺失导致 ID 解析异常 | 同上 |

### 部署相关

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| GitHub Pages 访问 404 | Pages Source 选错或 base 配置不一致 | 选择 GitHub Actions，检查 base 配置 |
| 静态资源 404 | 源码中硬编码 `/` 路径 | 替换为 `import.meta.env.BASE_URL` |
| Learn More 按钮跳转错误 | 配置中 URL 缺少 `/blog/` 前缀 | 在 twilight.config.yaml 中补全路径 |

### 功能相关

| 问题 | 原因 | 解决方案 |
|:---|:---|:---|
| 字体显示不统一 | 默认字体对中文覆盖不全 | 换用霞鹜文楷等中文字体 |
| 浏览量每次刷新 +10 | Umami 未配置就启用 | 先设 `enabled: false`，配置好再启用 |
| 音乐切标签页仍播放 | 框架未内置此功能 | 源码添加 visibilitychange 监听 |
| FLAC 文件 git 乱码 | git 未识别为二进制 | `.gitattributes` 添加 `*.flac binary` |
| 中文文件名路径异常 | URL 编码问题 | 静态资源统一使用英文文件名 |

## 常用命令

| 命令 | 说明 |
|:---|:---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm new-post <filename>` | 创建新文章 |

## 总结

从 Hexo 迁移到 Twilight 的过程总体顺利，但在子目录部署（非根路径）场景下坑比较多——主要是模板中部分路径硬编码了 `/`。建议做好 `CUSTOM_CHANGES.md` 备忘录，方便升级时快速重新应用修改。

Twilight 的配置文件设计得很清晰，大部分自定义都可以通过 `twilight.config.yaml` 完成。如果你也在考虑更换博客主题，Twilight 是一个非常不错的选择！

## 参考链接

- [Twilight GitHub](https://github.com/Spr-Aachen/Twilight)
- [Twilight 文档](https://docs.twilight.spr-aachen.com/)
- [Astro 官方文档](https://docs.astro.build/)
- [霞鹜文楷](https://github.com/lxgw/LxgwWenKai)
- [今日诗词 API](https://www.jinrishici.com/)
