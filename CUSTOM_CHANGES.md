# Twilight 自定义修改备忘录

升级 Twilight 模板后，需要重新应用以下源码级修改。

---

## 1. Astro 构建配置

**文件**: `astro.config.mjs`

**修改**: 设置子目录部署的 base 路径

```javascript
// 找到 base 配置项，修改为：
base: "/blog/",
```

---

## 2. 页面宽度

**文件**: `src/constants/constants.ts`

**修改**: 增加文章区域宽度（默认 90rem 太窄）

```typescript
// 找到 PAGE_WIDTH，修改为：
export const PAGE_WIDTH = 100;
```

---

## 3. 音乐播放器 - 页面可见性暂停

**文件**: `src/components/musicPlayer.svelte`

**修改**: 切换标签页/最小化窗口时自动暂停，回来后恢复播放

### 3.1 添加状态变量

在 `let showError = $state(false);` 后添加：

```javascript
// 页面隐藏前是否正在播放（用于切换标签页/最小化时暂停）
let wasPlayingBeforeHidden = false;
```

### 3.2 添加处理函数

在 `STORAGE_KEYS` 常量后添加：

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

### 3.3 注册/注销事件监听

- `onMount` 的 `handleAudioEvents();` 后：`document.addEventListener('visibilitychange', handleVisibilityChange);`
- `onDestroy` 中添加：`document.removeEventListener('visibilitychange', handleVisibilityChange);`

---

## 4. 今日诗词（每日诗句）

### 4.1 typewriterText.astro

**文件**: `src/components/common/typewriterText.astro`

**修改**: 添加 `jinrishici` Props 支持，构造函数中异步加载今日诗词 API

- Props 新增：`jinrishici?: boolean`
- span 新增：`data-jinrishici={jinrishici ? "true" : undefined}`
- TypewriterEffect 构造函数：检查 `data-jinrishici`，如有则先 fetch `https://v2.jinrishici.com/one.json` 再开始打字
- 原有逻辑提取为 `beginTyping()` 方法，新增 `loadJinrishici()` 异步方法

### 4.2 修复初始化时机

**问题**: 首次打开页面时打字机效果不触发，需切换页面后才正常

**原因**:
- 原脚本监听 `swup:contentReplaced`，但 Astro 实际用 `astro:after-swap`
- `DOMContentLoaded` 可能在 Loading Overlay 显示时就触发了

**修复**: 替换初始化逻辑为：

```javascript
// 初始化函数
function initTypewriters() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach((element) => {
        // 避免重复初始化
        if (!element.hasAttribute('data-initialized')) {
            element.setAttribute('data-initialized', 'true');
            new TypewriterEffect(element as HTMLElement);
        }
    });
}

// 监听 Astro 页面切换事件
document.addEventListener('astro:after-swap', initTypewriters);

// 初始页面加载
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriters);
} else {
    initTypewriters();
}
```

### 4.3 banner.astro

**文件**: `src/components/banner.astro`

**修改**: 给 TypewriterText 组件传递 `jinrishici={true}`

```astro
<TypewriterText
    text={config.banner.homeText.subtitle}
    ...
    jinrishici={true}
/>
```

---

## 5. 子目录部署路径修复

> 原因：Twilight 模板部分组件硬编码了根路径 `/`，在 `/blog/` 子目录部署时会导致资源 404

### 5.1 Pio 看板娘样式

**文件**: `src/layouts/base.astro`

```astro
<!-- 将硬编码路径改为动态路径 -->
{pioConfig.enable && <link rel="stylesheet" href={`${import.meta.env.BASE_URL}pio/static/pio.css`} />}
```

### 5.2 Pio 脚本加载

**文件**: `src/components/pio.svelte`

```javascript
// 将硬编码路径改为：
loadScript(`${import.meta.env.BASE_URL}pio/static/l2d.js`, "pio-l2d-script")
    .then(() => loadScript(`${import.meta.env.BASE_URL}pio/static/pio.js`, "pio-main-script"))
```

### 5.3 Pio 模型路径

**文件**: `src/components/pio.svelte`

在文件开头添加路径处理函数：

```javascript
// 处理模型路径，添加 BASE_URL
const processModelPaths = (models: string[] | undefined): string[] => {
    const defaultModels = [`${import.meta.env.BASE_URL}pio/models/pio/model.json`];
    if (!models || models.length === 0) return defaultModels;
    return models.map(path =>
        path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path
    );
};

// 然后在 pioOptions 中使用：
model: processModelPaths(pioConfig.models),
```

### 5.4 粒子特效图片

**文件**: `src/utils/particle.ts`

```typescript
// 将硬编码路径改为：
this.img.src = `${import.meta.env.BASE_URL}assets/images/particle.png`;
```

### 5.5 音乐播放器默认封面

**文件**: `src/components/musicPlayer.svelte`

```javascript
// 将默认封面路径改为：
cover: `${import.meta.env.BASE_URL}favicon/icon-light.ico`,
```

---

## 快速查找命令

```bash
# 查找 base 配置
grep -n "base:" astro.config.mjs

# 查找 PAGE_WIDTH
grep -n "PAGE_WIDTH" src/constants/constants.ts

# 查找可见性暂停
grep -n "visibilitychange" src/components/musicPlayer.svelte

# 查找今日诗词
grep -n "jinrishici" src/components/common/typewriterText.astro
grep -n "jinrishici" src/components/banner.astro

# 查找 BASE_URL 动态路径（子目录部署修复）
grep -n "import.meta.env.BASE_URL" src/layouts/base.astro
grep -n "import.meta.env.BASE_URL" src/components/pio.svelte
grep -n "import.meta.env.BASE_URL" src/utils/particle.ts
grep -n "import.meta.env.BASE_URL" src/components/musicPlayer.svelte
```

---

## 备份文件清单

| 内容 | 路径 |
|:---|:---|
| 静态资源 | `public/` |
| 文章内容 | `src/content/` |
| 站点配置 | `twilight.config.yaml` |

---

*最后更新: 2026-02-02*
