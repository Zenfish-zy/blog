---
title: Hexo Fluid 主题配置 LaTeX 数学公式渲染
published: 2026-01-27
tags:
  - Hexo
  - Fluid
  - LaTeX
category:
  - 博客搭建
  - Hexo
description: 在写技术博客或科研笔记时，经常需要使用数学公式。本文记录如何在 Hexo + Fluid 主题中配置 LaTeX 公式渲染。
routeName: 博客搭建/hexo-latex-config
---

# Hexo Fluid 主题配置 LaTeX 数学公式渲染

在写技术博客或科研笔记时，经常需要使用数学公式。本文记录如何在 Hexo + Fluid 主题中配置 LaTeX 公式渲染，支持 `$...$` 行内公式和 `$$...$$` 块级公式。

## 一、问题背景

### 1.1 默认渲染器的局限

Hexo 默认使用 `hexo-renderer-marked` 作为 Markdown 渲染器，但它存在以下问题：

- **不支持 `$` 语法**：会将 `$` 当作普通字符处理
- **符号冲突**：`_`（下划线）会被解析为斜体，破坏公式结构
- **转义问题**：`\\` 等 LaTeX 转义符可能被错误处理

### 1.2 Fluid 主题数学公式支持

Fluid 主题内置了 MathJax 和 KaTeX 的支持，但：

- 默认是**关闭**状态（`math.enable: false`）
- 需要配合支持数学公式的 Markdown 渲染器使用

---

## 二、解决方案

### 2.1 更换 Markdown 渲染器

卸载默认渲染器，安装 `hexo-renderer-markdown-it` 及数学公式插件：

```bash
# 卸载默认渲染器
npm uninstall hexo-renderer-marked

# 安装新渲染器和 MathJax 插件
npm install hexo-renderer-markdown-it markdown-it-mathjax3 --save
```

### 2.2 配置渲染器

在 Hexo 根目录的 `_config.yml` 中添加：

```yaml
# Markdown 渲染器配置 (markdown-it)
markdown:
  preset: 'default'
  render:
    html: true
    xhtmlOut: false
    langPrefix: 'language-'
    breaks: true
    linkify: true
    typographer: true
  plugins:
    - markdown-it-mathjax3
```

**配置项说明：**

| 选项 | 说明 |
|------|------|
| `preset` | 预设配置，`default` 为默认设置 |
| `html` | 允许 HTML 标签 |
| `breaks` | 换行符转为 `<br>` |
| `linkify` | 自动将 URL 转为链接 |
| `plugins` | 启用的插件列表 |

### 2.3 开启 Fluid 数学公式功能

在 `_config.fluid.yml`（主题覆盖配置）中添加：

```yaml
post:
  math:
    enable: true      # 开启数学公式
    specific: false   # false=全局生效，true=需在文章front-matter指定
    engine: mathjax   # 渲染引擎：mathjax 或 katex
```

**MathJax vs KaTeX 对比：**

| 特性 | MathJax | KaTeX |
|------|---------|-------|
| 渲染速度 | 较慢 | 更快 |
| 公式支持 | 更全面 | 基础功能 |
| 文件体积 | 较大 | 较小 |
| 推荐场景 | 复杂公式 | 简单公式、追求速度 |

### 2.4 重新生成网站

```bash
hexo clean && hexo g && hexo s
```

---

## 三、使用方法

### 3.1 行内公式

使用单个 `$` 包围：

```markdown
爱因斯坦质能方程：$E = mc^2$
```

效果：爱因斯坦质能方程：$E = mc^2$

### 3.2 块级公式

使用双 `$$` 包围：

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

效果：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### 3.3 常用公式示例

**求和公式：**

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

**矩阵：**

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$

**分段函数：**

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}
$$

**希腊字母与运算符：**

$$
\alpha, \beta, \gamma, \delta, \epsilon, \theta, \lambda, \mu, \sigma, \omega
$$

$$
\nabla \cdot \vec{E} = \frac{\rho}{\epsilon_0}
$$

---

## 四、按需加载（可选）

如果博客中只有少数文章需要公式，可以启用按需加载以提升性能：

### 4.1 修改配置

```yaml
post:
  math:
    enable: true
    specific: true   # 改为 true
    engine: mathjax
```

### 4.2 在文章中启用

在需要公式的文章 Front-matter 中添加：

```yaml
---
title: 我的数学笔记
math: true
---
```

---

## 五、常见问题

### Q1: 公式不渲染，显示原始代码

**可能原因：**
1. 未安装 `markdown-it-mathjax3` 插件
2. `_config.yml` 中未配置 plugins
3. Fluid 主题的 `math.enable` 未开启

**解决：** 检查上述三个配置是否正确。

### Q2: 下划线 `_` 导致公式错误

**原因：** Markdown 将 `_` 解析为斜体

**解决：**
- 使用 `\_` 转义
- 或确保使用了 `markdown-it-mathjax3` 插件（它会正确处理数学环境中的下划线）

### Q3: 公式在首页显示，但文章页不显示

**原因：** 可能是缓存问题

**解决：**
```bash
hexo clean && hexo g
```

### Q4: 想用 KaTeX 代替 MathJax

**步骤：**
1. 安装 KaTeX 插件：`npm install @vscode/markdown-it-katex --save`
2. 修改 `_config.yml` 的 plugins
3. 修改 Fluid 配置：`engine: katex`

---

## 六、相关依赖

| 包名 | 作用 |
|------|------|
| `hexo-renderer-markdown-it` | Markdown 渲染器 |
| `markdown-it-mathjax3` | MathJax 公式支持 |

**package.json 参考：**

```json
{
  "dependencies": {
    "hexo-renderer-markdown-it": "^x.x.x",
    "markdown-it-mathjax3": "^x.x.x"
  }
}
```

---

## 总结

配置 Hexo + Fluid 支持 LaTeX 公式的核心步骤：

1. **更换渲染器**：`hexo-renderer-marked` → `hexo-renderer-markdown-it`
2. **安装插件**：`markdown-it-mathjax3`
3. **配置渲染器**：在 `_config.yml` 添加 markdown 配置
4. **开启主题支持**：在 `_config.fluid.yml` 设置 `math.enable: true`

完成以上配置后，就可以愉快地在博客中使用 `$E=mc^2$` 这样的行内公式，以及 `$$...$$` 块级公式了！
