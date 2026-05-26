# 御守社

《御守社》是一个以东方 Project 同人风格为核心的抽签网页项目。当前版本强调明亮、精致、日式二次元场景感，而不是普通的抽签按钮页。

## 当前特性

- 首屏是路线选择入口，三条固定路线分别为博丽神社、红魔馆、永远亭。
- 抽签流程带有铃、签筒、结果卡和收藏记录。
- 页面使用统一的生成场景图与轻装饰素材，避免真实照片破坏整体风格。
- 支持本地收藏、重新查看今日签、设置弹层和动效降级。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Motion for React
- Zustand
- localStorage
- Web Audio API

## 运行方式

### 安装依赖

```powershell
cmd /c npm.cmd install
```

### 启动开发环境

```powershell
cmd /c npm.cmd run dev
```

默认地址：

- [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```powershell
cmd /c npm.cmd run build
```

## 验证

当前项目已经验证过：

```powershell
cmd /c npm.cmd run lint
cmd /c npm.cmd run build
```

## 目录结构

```text
H:\Project\御守社
├─ content
│  └─ omikuji
│     ├─ categories.json
│     └─ fortunes.json
├─ public
│  ├─ audio
│  │  ├─ ambience
│  │  ├─ music
│  │  ├─ prototypes
│  │  └─ sfx
│  ├─ images
│  │  ├─ characters
│  │  ├─ generated-themes
│  │  │  ├─ active
│  │  │  ├─ expanded
│  │  │  └─ legacy
│  │  ├─ textures
│  │  │  └─ washi-noise.svg
│  │  └─ ui
│  └─ fonts
├─ src
│  ├─ app
│  ├─ components
│  ├─ constants
│  ├─ hooks
│  ├─ lib
│  ├─ store
│  └─ types
└─ docs
   └─ 后续计划.md
```

## 素材分层

### `active`

当前主视觉与路线运行素材：

- `hakurei-scene.png`
- `scarlet-scene.png`
- `eientei-scene.png`
- `hakurei-stage-props.svg`
- `scarlet-stage-props.svg`
- `eientei-stage-props.svg`
- `ofuda-field.svg`
- `scarlet-roses.svg`
- `eientei-bamboo.svg`

### `expanded`

扩展候选场景池，暂不直接接入主路由：

- `hakugyokurou-scene.png`
- `forest-of-magic-scene.png`
- `divine-spirit-mausoleum-scene.png`
- `human-village-scene.png`
- `misty-lake-scene.png`
- `moriya-shrine-scene.png`
- `myouren-temple-scene.png`
- `nameless-hill-scene.png`
- `palace-of-earth-spirits-scene.png`
- `sanzu-river-scene.png`
- `sunflower-field-scene.png`

### `legacy`

历史遗留与过渡原型，仅作参考：

- `hakurei-hero.svg`
- `scarlet-hero.svg`
- `eientei-hero.svg`
- `kourindou-hero.svg`
- `hifuu-hero.svg`
- `kourindou-stage-props.svg`
- `hifuu-stage-props.svg`

## 关键模块

- `src/app/page.tsx`：页面入口
- `src/components/daily-draw-panel.tsx`：路线选择与抽签主流程
- `src/components/shrine-scene.tsx`：场景外壳
- `src/components/fortune-card.tsx`：结果卡
- `src/components/settings-modal.tsx`：设置面板
- `src/store/omamori-store.ts`：本地状态管理
- `src/constants/fortune.ts`：路线配置与文案

## 素材原则

1. 主页面和路线页优先使用完整场景图。
2. SVG 只用于前景、纹理、图标和轻装饰。
3. 角色素材只放在签面、收藏卡或图鉴位置。
4. 不太可能再用到的简单图片素材优先替换、合并或移入历史目录。
5. 新增素材继续按 `active / expanded / legacy` 三层归档。

## 参考文档

- [docs/后续计划.md](./docs/后续计划.md)
