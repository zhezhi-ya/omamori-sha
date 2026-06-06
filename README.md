# 御守社

《御守社》是一个以东方 Project 同人风格为核心的抽签网页项目。当前版本强调明亮、精致、日式二次元场景感，而不是普通的抽签按钮页。

本项目是非官方东方 Project 二次创作，不代表上海爱丽丝幻乐团或任何官方 / 授权项目。公开发布时应清楚标注 fan work / 二次创作身份，不使用原作游戏抽取素材，不让用户误认为官方内容，并遵循东方 Project 二次创作指南中关于浏览器游戏免费发布的要求。

## 当前特性

- 首屏是路线选择入口，当前开放 14 处正式签路：博丽神社、红魔馆、永远亭、守矢神社、白玉楼、魔法森林、命莲寺、地灵殿、三途川、雾之湖、人间之里、向日葵田、神灵庙、无名之丘。
- 每条路线都有自己的仪式命名、纸张形态、抽签道具、声音方向、阶段文案和结果标签。
- 抽签流程带有场景化仪式动画、结果卡和收藏记录。
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
cmd /c npm.cmd run test
cmd /c npx.cmd tsc --noEmit
cmd /c npm.cmd run build
```

## GitHub Pages 构建

当前项目按个人自用口径构建：默认保留本地角色图与本地 BGM，结果签面会直接加载 `public/images/characters/` 中的角色素材，背景环境音会优先读取 `public/audio/music/` 中的曲目。

```powershell
cmd /c npm.cmd run build:public
```

`build:public` 会以 GitHub Pages 静态导出口径构建，并在生成 `out/` 后裁剪公开包中的 `generated-themes/legacy`、raw PNG 场景 / 仪式源图与 source sheet；角色图和音乐目录会保留。

如需临时隐藏角色图，可显式关闭本地角色图片开关：

```powershell
$env:NEXT_PUBLIC_ENABLE_LOCAL_CHARACTER_IMAGES="false"
cmd /c npm.cmd run dev
```

如需临时隐藏本地 BGM，可显式关闭音乐开关：

```powershell
$env:NEXT_PUBLIC_ENABLE_LOCAL_MUSIC="false"
cmd /c npm.cmd run dev
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
   ├─ 后续计划.md
   ├─ 素材资产审计.md
   └─ 发布验收清单.md
```

## 素材分层

### `active`

基础路线的主视觉与运行素材：

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

当前 11 处扩展路线的运行素材与后续素材候选池。下列路线已经接入正式抽签流程，后续新增素材仍继续放在这一层中审计：

- `hakugyokurou-scene.png`
- `forest-of-magic-scene-v2.png`
- `divine-spirit-mausoleum-scene-v2.png`
- `human-village-scene-v2.png`
- `misty-lake-scene-v2.png`
- `moriya-shrine-scene.png`
- `myouren-temple-scene-v2.png`
- `nameless-hill-scene-v2.png`
- `palace-of-earth-spirits-scene-v3.png`
- `sanzu-river-scene.png`
- `sunflower-field-scene-v2.png`
- `rituals/<scene-id>/`：每条扩展路线的仪式预览图与动画拆层素材

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

## 二次创作声明

- 《御守社》是东方 Project 非官方二次创作 / fan work。
- 本项目不代表东方 Project 官方内容，也不与上海爱丽丝幻乐团存在官方授权关系。
- 项目素材应使用自制或已确认授权的二次创作素材；不得使用原作游戏抽取素材、拆包素材或官方图。
- 若作为浏览器游戏公开发布，应保持免费游玩，并继续核对最新东方 Project 二次创作指南。
- 参考指南：[东方 Project 二次创作指南](https://touhou-project.news/guideline/)

## 发布前合规状态

- 页面首屏、页面 metadata、Web App Manifest 和 OpenGraph 图已收拢为轻量项目口吻，不再在前端显著展示合规声明。
- 个人自用口径已恢复 `public/images/characters/lostword/` 中的早期 Touhou LostWord 角色图，并默认保留本地角色图加载。
- 当前公开版本不包含收费解锁或付费门槛；`unlockedVisualTheme` 仅用于稀有签视觉主题，不是付费功能。
- 默认构建加载本地角色图和本地 BGM；如需隐藏，可分别通过 `NEXT_PUBLIC_ENABLE_LOCAL_CHARACTER_IMAGES=false` 与 `NEXT_PUBLIC_ENABLE_LOCAL_MUSIC=false` 显式关闭。
- `npm audit --audit-level=moderate` 仍报告 Next 16.2.6 内置 `postcss@8.4.31` 的 moderate advisory，自动修复会强制降级到 `next@9.3.3`，因此不执行 `npm audit fix --force`，等待 Next 上游安全补丁或兼容升级路径。
- `build:public` 已提供 GitHub Pages 静态包裁剪流程；发布到公开站点前仍需按目标平台补严格 CSP / 响应头策略。

## 参考文档

- [docs/后续计划.md](./docs/后续计划.md)
- [docs/素材资产审计.md](./docs/素材资产审计.md)
- [docs/发布验收清单.md](./docs/发布验收清单.md)
