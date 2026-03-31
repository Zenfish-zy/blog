---
title: Hexo 小白入门指南
published: 2026-01-26
tags:
  - Hexo
  - GitHub Pages
  - 入门
category:
  - 博客搭建
  - Hexo
description: 作为一个刚入门的小白，我在搭建 Hexo 博客的过程中踩了不少坑。这篇文章总结了我的学习经验，希望能帮助到同样是新手的你！
routeName: 博客搭建/hexo-beginner-guide
---

# Hexo 小白入门指南

作为一个刚入门的小白，我在搭建 Hexo 博客的过程中踩了不少坑。这篇文章总结了我的学习经验，希望能帮助到同样是新手的你！

## 一、Hexo 是什么？

Hexo 是一个快速、简洁且高效的静态博客框架。它使用 Markdown 解析文章，能在几秒内生成静态网页。

**核心特点：**
- 超快速度：Node.js 驱动，生成速度极快
- 支持 Markdown：专注写作，格式简洁
- 一键部署：轻松部署到 GitHub Pages
- 丰富的主题和插件生态

---

## 二、核心概念

### 2.1 目录结构

```
你的博客项目/
├── _config.yml          # 站点配置文件
├── _config.fluid.yml    # 主题覆盖配置（推荐）
├── package.json         # Node.js 依赖
├── source/              # 源文件目录
│   ├── _posts/          # 文章存放处
│   ├── _drafts/         # 草稿（不会发布）
│   ├── about/           # 关于页面（需手动创建）
│   └── images/          # 图片资源
├── themes/              # 主题目录
├── public/              # 生成的静态文件
└── node_modules/        # 依赖包
```

### 2.2 两个配置文件的区别

| 文件 | 位置 | 作用 |
|------|------|------|
| `_config.yml` | 项目根目录 | 站点基本信息、URL、部署设置 |
| `_config.fluid.yml` | 项目根目录 | 主题个性化配置（覆盖主题默认设置） |

**为什么推荐用 `_config.fluid.yml`？**

因为它不会被主题更新覆盖！直接修改 `themes/fluid/_config.yml` 的话，更新主题时你的配置就丢了。

### 2.3 页面类型

| 类型 | 是否自动生成 | 说明 |
|------|-------------|------|
| 文章 | ✅ 自动 | 放在 `source/_posts/` 下的 md 文件 |
| 归档页 | ✅ 自动 | 内置生成器自动创建 |
| 标签页 | ✅ 自动 | 内置生成器自动创建 |
| 分类页 | ✅ 自动 | 内置生成器自动创建 |
| 关于页 | ❌ 手动 | 需要 `hexo new page about` 创建 |
| 友链页 | ❌ 手动 | 需要 `hexo new page links` 创建 |

---

## 三、常用命令

### 3.1 基础命令

```bash
# 创建新文章
hexo new "文章标题"
# 简写
hexo n "文章标题"

# 创建新页面（如关于页）
hexo new page about

# 生成静态文件
hexo generate
# 简写
hexo g

# 启动本地服务器预览
hexo server
# 简写
hexo s
# 指定端口
hexo s -p 4001

# 清除缓存和已生成的文件
hexo clean
# 简写
hexo cl

# 部署到远程服务器
hexo deploy
# 简写
hexo d
```

### 3.2 常用组合

```bash
# 本地预览（清理 → 生成 → 启动服务）
hexo cl && hexo g && hexo s

# 部署上线（清理 → 生成 → 部署）
hexo cl && hexo g && hexo d

# 生成并部署
hexo g -d
```

---

## 四、写文章

### 4.1 创建文章

```bash
hexo new "我的第一篇文章"
```

这会在 `source/_posts/` 下创建 `我的第一篇文章.md` 文件。

### 4.2 文章格式

```markdown
---
title: 文章标题
date: 2026-01-26 12:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
---

这里是文章摘要，会显示在首页。

<!-- more -->

这里是正文内容，点击"阅读更多"才能看到。

## 二级标题

正文内容...

### 三级标题

更多内容...
```

### 4.3 Front-matter 说明

文章开头 `---` 之间的部分叫 Front-matter，常用字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | `title: Hello World` |
| `date` | 创建日期 | `date: 2026-01-26 12:00:00` |
| `tags` | 标签（可多个） | `tags: [Hexo, 教程]` |
| `categories` | 分类 | `categories: 技术` |
| `cover` | 封面图 | `cover: /images/cover.jpg` |
| `excerpt` | 摘要 | `excerpt: 这是摘要` |

---

## 五、部署到 GitHub Pages

### 5.1 前置准备

1. 注册 GitHub 账号
2. 创建仓库，命名为 `你的用户名.github.io`
3. 配置 SSH Key（用于免密推送）

### 5.2 安装部署插件

```bash
npm install hexo-deployer-git --save
```

### 5.3 配置部署信息

编辑 `_config.yml`：

```yaml
deploy:
  type: git
  repo: git@github.com:你的用户名/你的用户名.github.io.git
  branch: master  # 或 main，取决于你的仓库设置
```

### 5.4 部署

```bash
hexo cl && hexo g && hexo d
```

等待 1-3 分钟后访问 `https://你的用户名.github.io/`

---

## 六、常见问题

### Q1: Cannot GET /about/

**原因：** 没有创建 about 页面

**解决：**
```bash
hexo new page about
```

### Q2: 端口被占用

**错误信息：** `FATAL Port 4000 has been used`

**解决：** 换个端口
```bash
hexo s -p 4001
```

### Q3: 部署后网站没更新

**可能原因：**
1. GitHub Pages 需要几分钟生效
2. 浏览器缓存

**解决：**
- 等待 1-3 分钟
- 用无痕模式访问
- `Ctrl + Shift + R` 强制刷新

### Q4: 图片不显示

**解决：** 安装图片插件
```bash
npm install hexo-asset-image --save
```

---

## 七、更新博客流程

记住这个简单的流程：

```
1. 写文章/改内容
      ↓
2. hexo cl && hexo g && hexo s  （本地预览）
      ↓
3. hexo d  （部署上线）
```

或者一条命令：

```bash
hexo cl && hexo g && hexo d
```

---

## 八、推荐插件

| 插件 | 作用 | 安装命令 |
|------|------|---------|
| hexo-deployer-git | Git 部署 | `npm install hexo-deployer-git --save` |
| hexo-asset-img | 本地图片支持 | `npm install hexo-asset-img --save` |
| hexo-generator-feed | RSS 订阅 | `npm install hexo-generator-feed --save` |
| hexo-generator-sitemap | 站点地图 | `npm install hexo-generator-sitemap --save` |

---

## 总结

Hexo 的核心就三件事：

1. **写内容** → `source/` 目录下写 Markdown
2. **生成页面** → `hexo generate` 把 md 变成 html
3. **部署上线** → `hexo deploy` 推送到 GitHub

掌握这些基础，你就可以愉快地写博客了！更多高级功能可以慢慢探索。
