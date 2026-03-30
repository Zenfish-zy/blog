---
title: Typora Hexo Front Matter 插件
published: 2026-01-27
tags:
  - Typora
  - Hexo
  - Front Matter
  - 插件
category:
  - 博客搭建
  - 写作工具
description: 这是一个为 Typora 编辑器开发的插件，用于快速插入 Hexo 博客所需的 YAML Front Matter 模板。
---

# Typora Hexo Front Matter 插件使用说明

## 插件简介

这是一个为 Typora 编辑器开发的插件,用于快速插入 Hexo 博客所需的 YAML Front Matter 模板。在这个佬的[插件](https://github.com/obgnail/typora_plugin)上vibecoding的。代码小白，若有不合理的地方请多担待。

## 功能特点

- ✅ 右键菜单快速插入
- ✅ 自动填充当前日期时间
- ✅ 防止重复插入
- ✅ 自动定位光标到标题字段
- ✅ 保持文件原有格式(BOM、换行符等)

## 安装方法

插件文件已经安装到以下位置:

1. **插件代码:** `Typora\resources\plugin\custom\plugins\hexoFrontMatter.js`
2. **插件配置:** `Typora\resources\plugin\global\settings\custom_plugin.user.toml`

## 使用方法

### 1. 重启 Typora

安装插件后,需要重启 Typora 以加载新插件。

### 2. 使用插件

1. 在 Typora 中打开或新建一个 Markdown 文件
2. 在编辑区域右键点击
3. 在右键菜单中选择 **"常用插件" → "二级插件" → "插入 Hexo Front Matter"**
4. 插件会自动在文件开头插入模板,并将光标定位到 `title:` 字段后
5. 直接输入标题,然后按 Tab 或方向键移动到其他字段填写

### 3. 插入的模板格式

```yaml
---
title:
date: 2026-01-27 14:30:00
tags:
  -
categories:
  -
---
```

- **title:** 标题字段,需要手动填写
- **date:** 日期字段,自动填充为插入时的当前时间
- **tags:** 标签字段,可以添加多个标签
- **categories:** 分类字段,可以添加多个分类

## 注意事项

### 1. 重复插入保护

如果文件已经包含 Front Matter(以 `---` 开头),插件会弹出提示:

```
文件已包含 Front Matter,无需重复插入
```

此时不会执行插入操作,以保护现有内容。

### 2. 光标定位

- **源代码模式:** 插件会自动将光标定位到 `title:` 字段后,方便直接输入
- **所见即所得模式:** 插件会插入模板,但光标定位可能不生效(这是 Typora 的限制)

建议在源代码模式下使用插件以获得最佳体验。

### 3. 撤销操作

插入操作支持撤销(Ctrl+Z),如果不小心插入了,可以立即撤销。

### 4. 文件格式保持

插件会自动保持文件的原有格式:
- **BOM:** 如果文件有 BOM,插件会保留
- **换行符:** 插件会使用文件原有的换行符(CRLF 或 LF)

## 自定义配置

如果需要修改插件配置,可以编辑配置文件:

```
Typora\resources\plugin\global\settings\custom_plugin.user.toml
```

### 可配置项

```toml
[hexoFrontMatter]
name = "插入 Hexo Front Matter"  # 插件名称
enable = true                    # 是否启用
hide = false                     # 是否在菜单中隐藏
order = 1                        # 菜单中的显示顺序
hotkey = ""                      # 快捷键(可选,如 "ctrl+alt+h")
template = """..."""             # 模板内容
```

### 自定义模板

可以修改 `template` 字段来自定义模板内容。模板中可以使用以下占位符:

- `{{datetime}}` - 会被替换为当前日期时间(格式: YYYY-MM-DD HH:mm:ss)

示例:添加更多字段

```toml
template = """---
title:
date: {{datetime}}
tags:
  -
categories:
  -
author: 你的名字
description:
---"""
```

### 添加快捷键

如果想通过快捷键触发插件,可以设置 `hotkey` 字段:

```toml
hotkey = "ctrl+alt+y"
```

修改后需要重启 Typora 才能生效。让AI给实现了ctrl+alt+y插入

## 故障排除

### 1. 插件不显示在菜单中

- 检查配置文件中 `enable = true`
- 检查配置文件中 `hide = false`
- 重启 Typora

### 2. 插入后格式不正确

- 检查配置文件中的 `template` 字段
- 确保模板格式正确(YAML 语法)
- 注意缩进使用空格而非 Tab

### 3. 光标定位不生效

- 切换到源代码模式(Ctrl+/)
- 在源代码模式下使用插件

### 4. 日期格式不正确

- 日期格式固定为 `YYYY-MM-DD HH:mm:ss`
- 如需修改格式,需要修改插件代码中的 `dateTimeFormat` 调用

---

**插件版本:** 1.0.0
**开发者:** 哈雷酱 (傲娇大小姐工程师)
**开发日期:** 2026-01-27
**兼容性:** Typora 0.9.98+
