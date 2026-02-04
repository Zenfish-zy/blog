# 自定义修改记录

> 更新主题时需要重新应用的修改。个人数据（public/、src/content/、twilight.config.yaml）直接迁移即可，以下是**代码层面**的自定义改动。

---

## 1. BASE_URL 适配（base: "/blog/"）

因为部署在子路径 `/blog/` 下，需要将硬编码的 `/` 路径替换为 `import.meta.env.BASE_URL`。

### astro.config.mjs
```diff
- base: "/",
+ base: "/blog/",
```
```diff
  markdown: {
+     smartypants: false,
      remarkPlugins: [
```

### src/layouts/base.astro
```diff
- {pioConfig.enable && <link rel="stylesheet" href="/pio/static/pio.css" />}
+ {pioConfig.enable && <link rel="stylesheet" href={`${import.meta.env.BASE_URL}pio/static/pio.css`} />}
```

### src/layouts/grid.astro（作者修复，可能已合入新版本）
```diff
+ import { url, pathsEqual } from "@utils/url";

- const isHomePage = Astro.url.pathname === "/" || Astro.url.pathname === "";
+ const isHomePage = pathsEqual(Astro.url.pathname, url("/"));
```

### src/components/pio.svelte
```diff
+ const processModelPaths = (models: string[] | undefined): string[] => {
+     const defaultModels = [`${import.meta.env.BASE_URL}pio/models/pio/model.json`];
+     if (!models || models.length === 0) return defaultModels;
+     return models.map(path =>
+         path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path
+     );
+ };

- model: pioConfig.models || ["/pio/models/pio/model.json"],
+ model: processModelPaths(pioConfig.models),

- loadScript("/pio/static/l2d.js", "pio-l2d-script")
-     .then(() => loadScript("/pio/static/pio.js", "pio-main-script"))
+ loadScript(`${import.meta.env.BASE_URL}pio/static/l2d.js`, "pio-l2d-script")
+     .then(() => loadScript(`${import.meta.env.BASE_URL}pio/static/pio.js`, "pio-main-script"))
```

### src/components/musicPlayer.svelte（路径部分）
```diff
- cover: "/favicon/icon-light.ico",
+ cover: `${import.meta.env.BASE_URL}favicon/icon-light.ico`,
```

### src/utils/particle.ts
```diff
- this.img.src = "/assets/images/particle.png";
+ this.img.src = `${import.meta.env.BASE_URL}assets/images/particle.png`;
```

---

## 2. 今日诗词功能（jinrishici）

在打字机副标题中集成今日诗词 API。

### src/components/banner.astro
```diff
  <TypewriterText
      text={config.banner.homeText.subtitle}
      speed={config.banner.homeText.typewriter.speed}
      deleteSpeed={config.banner.homeText.typewriter.deleteSpeed}
      pauseTime={config.banner.homeText.typewriter.pauseTime}
+     jinrishici={true}
  />
```

### src/components/common/typewriterText.astro
- Props 新增 `jinrishici?: boolean` 参数
- HTML 新增 `data-jinrishici` 属性
- TypewriterEffect 类新增 `loadJinrishici()` 异步方法，从 `https://v2.jinrishici.com/one.json` 获取诗句并添加到文本列表开头
- 构造函数中根据 `jinrishici` 标志决定是否异步加载
- 初始化逻辑从 `DOMContentLoaded` + `swup:contentReplaced` 改为 `astro:after-swap` + readyState 判断，并添加 `data-initialized` 防重复初始化

---

## 3. 音乐播放器定制

### src/components/musicPlayer.svelte
- 默认音量从 0.75 改为 0.03
- 新增页面可见性变化处理：切换标签页/最小化窗口时暂停音乐，回来后恢复播放

---

## 4. 配置修改

### src/config.ts
```diff
- enabled: config.umami.enabled,
+ enabled: false,

- baseUrl: config.umami.baseUrl,
+ baseUrl: "https://api.umami.is",
```

---

## 更新步骤

1. 备份：`public/`、`src/content/`、`twilight.config.yaml`
2. 下载新版模板，替换整个项目
3. 迁回备份的个人数据
4. 按照本文档重新应用上述代码修改
5. `astro.config.mjs` 中设置 `base: "/blog/"` 和 `oauthDisabled` 等配置
6. 运行 `pnpm install && pnpm dev` 测试
