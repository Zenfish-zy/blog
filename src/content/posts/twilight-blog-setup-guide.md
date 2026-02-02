---
title: 从 Hexo 迁移到 Twilight：完整博客搭建教程
published: 2026-02-02 12:00
tags:
  - Twilight
  - Astro
  - 博客
  - 教程
category: 技术教程
description: 记录从 Hexo 迁移到 Twilight 博客主题的完整过程，包括环境搭建、内容迁移、个性化配置和部署到 GitHub Pages。
---

## 前言

之前一直使用 Hexo 搭建博客，但偶然发现了 [Twilight](https://github.com/Spr-Aachen/Twilight) 这个基于 Astro 的博客主题，被它精美的 UI 和丰富的功能所吸引，于是决定迁移过来。

本文记录了完整的迁移和配置过程，希望对有同样需求的朋友有所帮助。

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
category: 分类名
description: 文章描述
---
```

主要变化：
- `date` → `published`
- `categories`（数组）→ `category`（字符串）
- 新增 `description` 字段

### 迁移步骤

1. 将 Hexo 的 `source/_posts/` 下的 `.md` 文件复制到 Twilight 的 `src/content/posts/`
2. 批量修改 Front Matter 格式
3. 检查图片路径，确保图片正确引用

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

### 壁纸配置

```yaml
site:
    wallpaper:
        mode: "banner"  # banner | fullscreen | none
        src:
            desktop:
                - "/assets/images/desktopWallpaper_1.jpg"
            mobile:
                - "/assets/images/mobileWallpaper_1.jpg"
        carousel:
            enable: true
            interval: 3.6
```

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
              url: "/assets/music/song.mp3"
              duration: 228
    autoplay: true
```

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

## 源码级自定义修改

有些配置目前不在 `twilight.config.yaml` 中，需要修改源码。

### 调整页面宽度

文件：`src/constants/constants.ts`

```typescript
// 默认 90rem，可改大一些
export const PAGE_WIDTH = 100;
```

### 调整默认音量

文件：`src/components/musicPlayer.svelte`

```javascript
// 默认 0.75，改小一些
let volume = $state(0.05);
```

> **注意**：这些修改在升级模板时会被覆盖，建议记录在备忘录中。

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
template = "---\ntitle: \npublished: {{datetime}}\ntags:\n  - \ncategory: \ndescription: \n---"
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
| 文章内容 | `src/content/` | 所有博客内容 |
| 站点配置 | `twilight.config.yaml` | 所有配置项 |

### 源码修改备忘

升级模板后需要重新应用的修改：
1. `astro.config.mjs` → `base: "/blog/"`
2. `src/constants/constants.ts` → `PAGE_WIDTH = 100`
3. `src/components/musicPlayer.svelte` → `volume = $state(0.05)`

## 常用命令

| 命令 | 说明 |
|:---|:---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览构建结果 |
| `pnpm new-post <filename>` | 创建新文章 |

## 总结

从 Hexo 迁移到 Twilight 的过程比想象中顺利，Twilight 的配置文件设计得很清晰，大部分自定义都可以通过 `twilight.config.yaml` 完成。

如果你也在考虑更换博客主题，Twilight 是一个非常不错的选择！

## 参考链接

- [Twilight GitHub](https://github.com/Spr-Aachen/Twilight)
- [Twilight 文档](https://docs.twilight.spr-aachen.com/)
- [Astro 官方文档](https://docs.astro.build/)
