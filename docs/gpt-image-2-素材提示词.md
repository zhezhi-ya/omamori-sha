# GPT Image 2 素材提示词清单

本文档用于记录 GPT Image 2 素材补全提示词、抽签动画素材设计规格与落盘状态。2026-05-24 已按本文档优先级补全 8 张缺失的独立仪式预览素材；2026-05-25 已落盘并接入 14 个场景的动画拆层素材包。当前素材侧已收口，后续若继续生成图片，仍优先参考本文档并保持当前网页的全屏二次元场景 UI 风格；短期工作重心转向新增场景界面文案润色、地点气质校准和真实 UI 回归。

## 使用原则

- 模型：GPT Image 2。
- 输出类型：PNG，建议先生成 `1536x1024` 横图；如果只做道具组合，可用 `1024x1024` 方图。
- 风格：明亮、干净、日式二次元游戏资产，和 `public/images/generated-themes/` 现有素材保持一致。
- 构图：优先保留可放 UI 文案的留白，不要把道具堆满画面。
- 禁止：真实照片、角色人物、文字、水印、Logo、复杂纹理、泛用奇幻城堡、抽象几何图标。
- 每张图都应有地点辨识物、抽签道具、签纸形态和一处轻微不合常理的小细节。
- 生成后只复制最终选中的图片到项目目录；保留 `.codex/generated_images/` 原图，不需要删除。

## 〇、14 场景抽签动画素材包总纲

当前项目一共按 14 个场景规划抽签动画：3 个 `active` 正式场景，加 11 个 `expanded` 候选场景。`public/images/generated-themes/expanded/rituals/*-ritual-kit-v1.png` 这类文件是“静态仪式预览图 / 概念图”，可用于候选卡、蓝图展示和生图参考；它们不等同于可直接驱动抽签动画的拆层素材。

真正实现“进入抽签场景后，播放抽签动画，再展示签面”时，每个场景使用一套可动画化素材包。当前 14 个场景的素材包已落盘并接入正式抽签流程，个别角标缺陷也已修复。素材包应至少包含：

| 素材层 | 用途 | 建议规格 |
| --- | --- | --- |
| `ritual-base.png` | 静止主道具，含签筒、托盘、签匣、供案等核心物件 | 透明背景 PNG，1024x1024 或 1536x1024 |
| `paper-closed.png` | 签纸未展开状态 | 透明背景 PNG，保持纸张轮廓清晰 |
| `paper-emerging.png` | 签纸抽出 / 浮出中间状态 | 透明背景 PNG，保留与主道具的方向关系 |
| `paper-open.png` | 签纸展开但无文字状态 | 透明背景 PNG，后续由 UI 覆盖签文 |
| `fx-particles.png` | 粒子、花瓣、雾、纸垂、星屑等前景 FX | 透明背景 PNG，可循环漂移 |
| `fx-reveal.png` | 揭示瞬间的光、波纹、刀光、水纹、封印等 | 透明背景 PNG，只在 reveal 阶段短暂显示 |
| `result-corner.png` | 结果签面角落点缀，可选 | 透明背景 PNG，用于 FortunePaper / FortuneCard 主题化 |

动画拆层素材放在以下目录，避免和现有扁平化静态预览图混淆：

```text
public/images/generated-themes/active/rituals/<scene-id>/
public/images/generated-themes/expanded/rituals/<scene-id>/
```

现有 `public/images/generated-themes/expanded/rituals/<scene-id>-ritual-kit-v1.png` 继续保留为单张静态仪式预览图，不要覆盖。

### 14 场景素材状态总览

| 场景 | 当前已有素材 | 当前仍缺素材 | 动画方向 |
| --- | --- | --- | --- |
| 博丽神社 `hakurei` | 主场景图、前景叠层、轻装饰、静态仪式预览图、动画拆层包、结果角标 | 无 | 参拜式：铃绳、神乐铃、旧木签筒、御札、结界回声 |
| 红魔馆 `scarlet` | 主场景图、前景叠层、轻装饰、静态仪式预览图、动画拆层包、结果角标 | 无 | 茶会式：银托盘、红茶、玫瑰、怀表、茶牌式签纸 |
| 永远亭 `eientei` | 主场景图、前景叠层、轻装饰、静态仪式预览图、动画拆层包、结果角标 | 无 | 问药式：药签匣、药包、月兔脚步、竹影、药方签 |
| 守矢神社 `moriya-shrine` | 背景图、静态仪式预览图、动画拆层包、结果角标 | 无 | 风祝式：风祝铃、注连绳、纸垂、卷轴签、奇迹粒子 |
| 白玉楼 `hakugyokurou` | 背景图、静态仪式预览图、动画拆层包、结果角标 | 无 | 幽冥式：樱庭签台、半透明冥签、樱花、冷色刀光 |
| 魔法森林 `forest-of-magic` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 魔导式：魔导书、蘑菇、玻璃瓶、星屑纸符、孢子光 |
| 命莲寺 `myouren-temple` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 寺院式：经卷签台、寺院灯、木鱼、莲纹短签、落花 |
| 地灵殿 `palace-of-earth-spirits` | 背景 v3、静态仪式预览图、动画拆层包、结果角标 | 无 | 心读式：第三只眼签匣、暗红紫签纸、煤火、地底回声 |
| 三途川 `sanzu-river` | 背景图、静态仪式预览图、动画拆层包、结果角标 | 无 | 渡河式：渡船签盒、旧船桨、摆渡钱、水面倒影、河雾签 |
| 雾之湖 `misty-lake` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 冰雾式：浅木托盘、薄冰、半透明短签、水纹、妖精光点 |
| 人间之里 `human-village` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 街巷式：木抽屉、灯笼、账册、布告、街风翻签 |
| 向日葵田 `sunflower-field` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 季节异变式：旧木牌、小签箱、阳伞、花瓣、慢半拍影子 |
| 神灵庙 `divine-spirit-mausoleum` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 道场式：供案、玉笏、铜铃、道符、青白灵签、八角光阵 |
| 无名之丘 `nameless-hill` | 背景 v2、静态仪式预览图、动画拆层包、结果角标 | 无 | 遗忘式：无标签玻璃瓶、灰白短签、铃兰影、贴地薄雾 |

### 生成前 OOC 审查任务流

后续 AI 在选择提示词前，必须先做一次素材 OOC 审查。不要只按“缺图”机械生成；先判断现有图是可继续使用、只需动画拆层，还是已经偏离地点气质，需要修背景或重做仪式图。

任务流：

1. 先确定目标素材属于哪一类：背景图、静态仪式预览图、动画拆层素材包、结果签面点缀。
2. 再查下表确认现有素材的 OOC 状态。如果已有 `v2` 被标记为当前候选图，后续不要把旧版重新接回配置。
3. 如果只是要实现抽签动画，优先生成 `ritual-base`、纸张三态、`fx-particles`、`fx-reveal` 等透明拆层，不要因为旧背景有小问题就先重做整张背景。
4. 只有当背景本身会明显破坏地点辨识度，或真实 UI 审图发现候选静态仪式图过暗、过密、地点跑偏时，才进入“背景 v2 / 仪式图 v2”任务。
5. 生成完成后同时更新本文档的状态、`docs/后续计划.md` 的素材状态，以及对应 UI 配置里的 `sceneImage` / `ritualImage`。

| 素材 | OOC 状态 | 任务流决策 |
| --- | --- | --- |
| `palace-of-earth-spirits-scene.png` | OOC 最明显，太像红魔馆或地狱城堡，外向、哥特、开放感过强 | 不再接回候选配置；以地下、封闭、向内的地灵殿为修正方向：旧地狱遗址深处、低矮石廊、煤灯 / 地底灯、第三只眼纹样、管线、温泉雾或火焰余光 |
| `divine-spirit-mausoleum-scene.png` | 偏泛用神秘神社，缺少神灵庙的道教、石阶、墓庙感 | 不再接回候选配置；修正方向是道观 / 陵庙结构、长石阶、墓门、青绿色灵光、道教符、旧石碑和供台 |
| `palace-of-earth-spirits-scene-v2.png` | 已归档到 `legacy/unused-2026-05-25/expanded/` | 不再接回当前配置；当前候选图使用 `palace-of-earth-spirits-scene-v3.png` |
| `palace-of-earth-spirits-scene-v3.png` | 已修第二版 | 保留为当前候选图；后续若继续生成，只做简洁风格微调，不增加复杂纹理 |
| `divine-spirit-mausoleum-scene-v2.png` | 已修第一版 | 保留为当前候选图；后续若继续生成，只做简洁风格微调，不增加复杂纹理 |
| `sunflower-field-scene.png` | 不算 OOC，但太像旅游宣传片 | 不再作为当前候选图；已切到 `sunflower-field-scene-v2.png`，旧图只作为参考 |
| `human-village-scene.png` | 不算 OOC，但略像精致观光街景 | 不再作为当前候选图；已切到 `human-village-scene-v2.png`，旧图只作为参考 |
| `hakurei-scene.png` / `eientei-scene.png` / `moriya-shrine-scene.png` / `hakugyokurou-scene.png` / `sanzu-river-scene.png` | 基调较稳 | 先不要重做整张背景；后续通过旧纸、木头、烟火气、局部风向和一处轻微不合常理的小细节，补到仪式图或动画拆层里 |

OOC 审查后的优先级判断：

| 情况 | 优先动作 | 不要做 |
| --- | --- | --- |
| 目标场景已有可用背景，但缺抽签动画 | 直接生成动画拆层素材包 | 不要先重画整张背景 |
| 旧背景已被 `v2` 替代 | 继续使用 `v2` 作为参考 | 不要把旧背景重新写回 `SCENE_CANDIDATES` |
| 静态仪式预览图在 UI 中过暗、过密或跑题 | 生成 `*-ritual-kit-v2.png`，并保留旧图 | 不要覆盖 `*-ritual-kit-v1.png` |
| 背景明显 OOC 且没有可用 v2 | 使用“场景背景二次修订提示词”生成背景 v2 | 不要把泛用奇幻素材继续扩展成动画 |
| active 正式路线基调稳定 | 优先补动画拆层和结果签面点缀 | 不要为了“更华丽”重做主背景 |

### 动画拆层提示词通用模板

生成拆层素材时，不要让模型画完整 UI，也不要让模型把签文写在纸上。每张图应说明它是哪一层、是否透明背景、是否包含文字、是否可循环动效。

```text
Use case: animation-layer
Asset type: transparent PNG layer for a Touhou-inspired web omikuji draw animation
Scene: <scene label and ritual type>
Layer needed: <ritual-base | paper-closed | paper-emerging | paper-open | fx-particles | fx-reveal | result-corner>
Primary request: Create one clean isolated animation layer for <specific object or effect>.
Style/medium: bright clean Japanese anime game asset, matching existing public/images/generated-themes style, no photorealism.
Composition/framing: centered object, transparent background, readable silhouette, enough empty edges for animation movement.
Materials/textures: simple paper/wood/metal/glass/stone texture only, low detail density.
Constraints: no characters, no readable text, no watermark, no logo, no UI frame, no real photo.
Avoid: full scene background, dense decoration, complex symbols, western occult motifs, generic fantasy props.
```

### 14 场景动画提示词方向

下面是后续生成动画拆层时的核心描述。每个场景都应按同一套拆层素材名生成，不要只生成一张大合成图。

| 场景 | 核心道具层 | 签纸层 | FX 层 / 揭示层 |
| --- | --- | --- | --- |
| 博丽神社 | 旧木签筒、铃绳、神乐铃、赛钱箱边缘 | 米白长御札签，红白边和朱印，无文字 | 御札碎片、红白结界波纹、暖金尘粒 |
| 红魔馆 | 银托盘、红茶杯、琉璃签匣、怀表光斑 | 奶油色茶牌式长签，银边和玫瑰水印，无文字 | 红茶蒸汽、玫瑰花瓣、怀表停顿光 |
| 永远亭 | 月下药签匣、药包、玻璃药瓶、竹影屏 | 淡青药方签，浅月纹和竹叶压印，无文字 | 月光脉冲、白兔脚印光点、冷雾和竹影掠过 |
| 守矢神社 | 风祝铃、注连绳签架、御柱感木桩 | 淡绿白色卷轴签，蛙蛇纹压印，无文字 | 山叶、纸垂摆动、云影和奇迹粒子 |
| 白玉楼 | 白木樱庭签台、石阶底座 | 半透明粉银冥签，无文字 | 樱花瓣、薄雾、冷色刀光线 |
| 魔法森林 | 树根半开魔导书、发光蘑菇、小玻璃瓶 | 淡紫星屑纸符，无文字 | 孢子光点、书页风、星屑沿纸边点亮 |
| 命莲寺 | 经卷签台、寺院灯、木鱼 | 暖白莲纹短签，无文字 | 寺灯微光、落花、经卷展开光 |
| 地灵殿 | 黑木心读签匣、第三只眼纹样、煤火小炉 | 暗红紫短签，无文字 | 煤火脉冲、怨灵微光、记忆回声纹 |
| 三途川 | 无帆渡船边缘、小木签盒、旧船桨、摆渡钱 | 灰蓝潮湿短签，无文字 | 水面倒影、低雾、水纹推签 |
| 雾之湖 | 湖边浅木托盘、薄冰边缘 | 浅蓝半透明短签，无文字 | 横向湖雾、冰晶、小妖精光点、水纹扩散 |
| 人间之里 | 街巷小木抽屉、灯笼、账册、布告板 | 米白短签，无文字 | 灯笼晃动、街风纸角、尘光 |
| 向日葵田 | 旧木牌、小签箱、旧阳伞 | 淡金短签，无文字 | 向日葵花瓣、阳光闪、慢半拍影子 |
| 神灵庙 | 道教陵庙供案、玉笏、铜铃、无字道符 | 青白金边灵签，无文字 | 青绿色神灵粒子、八角形符光、石阶回声 |
| 无名之丘 | 半埋玻璃瓶、褪色细绳、铃兰影 | 灰白短签，保留擦去名字的空白区，无文字 | 贴地薄雾、低日光、少量幽光 |

## 一、优先补全的独立仪式素材

这些图用于 `SCENE_CANDIDATES[].ritualImage`，属于静态仪式预览图 / 概念图。它们可以帮助后续 AI 理解场景仪式类型，也可作为候选 UI 里的预览图，但不能替代上文 14 场景动画素材包里的拆层 PNG。保存目录统一为：

```text
public/images/generated-themes/expanded/rituals/
```

2026-05-24 已落盘的静态仪式预览图（14 张静态仪式预览已收口）：

| 文件 | 状态 |
| --- | --- |
| `moriya-shrine-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `hakugyokurou-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `palace-of-earth-spirits-ritual-kit-v1.png` | 已由 `palace-of-earth-spirits-ritual-kit-v1.png` 统一命名；已生成静态预览；动画拆层已落盘 |
| `divine-spirit-mausoleum-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `forest-of-magic-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `myouren-temple-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `sanzu-river-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `human-village-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `sunflower-field-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `misty-lake-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `nameless-hill-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `hakurei-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘 |
| `scarlet-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘，`result-corner.png` 待补强 |
| `eientei-ritual-kit-v1.png` | 已生成静态预览；动画拆层已落盘，`result-corner.png` 待补强 |

本轮已补齐 3 张正式路线的静态仪式预览图：`hakurei-ritual-kit-v1.png`、`scarlet-ritual-kit-v1.png`、`eientei-ritual-kit-v1.png`。现阶段 14 个场景的静态仪式预览图与动画拆层素材包均已落盘；后续优先级转向 UI 接入、空白角标修复、命名统一与素材归档，而不是继续补单张合成预览图。

### 1. 神灵庙仪式图

建议文件名：

```text
divine-spirit-mausoleum-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Divine Spirit Mausoleum, focused on Taoist mausoleum divination.
Scene/backdrop: a quiet Senkai Taoist shrine courtyard with pale stone steps, square paving, red painted pillars, a hint of golden glazed roof tiles, and two distant octagonal side towers.
Subject: a simple offering table with a jade tablet, small bronze bell, a few blank Taoist talisman papers, blue-white fortune slips with thin gold edges, and small teal spirit particles rising from the stone steps.
Style/medium: polished 2D Japanese anime game asset, clean layered composition, readable silhouettes, no photorealism.
Composition/framing: centered ritual table in the foreground, stone steps leading upward in the midground, enough negative space for UI text, landscape 1536x1024.
Lighting/mood: bright, solemn, airy, slightly otherworldly, not dark horror.
Color palette: jade green, blue-white paper, muted red pillars, pale stone, small gold accents.
Materials/textures: smooth stone, clean paper, polished bronze, subtle roof tile shine; low texture density.
Constraints: no characters, no readable text, no watermark, no logo; make it clearly Taoist mausoleum, not a generic Shinto shrine.
Avoid: torii gates, forest temple cliches, crowded decorations, western occult symbols, heavy fog, photorealistic render.
```

### 2. 魔法森林仪式图

建议文件名：

```text
forest-of-magic-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for the Forest of Magic, focused on playful magical divination.
Scene/backdrop: a damp but charming forest floor with old tree roots, soft moss, sparse shadows, and a few glowing mushroom caps.
Subject: a half-open old magic book resting on a tree root, two or three glowing mushrooms, a tiny glass bottle, pale purple star-dust paper charms, floating spore lights, and one blank fortune slip lifting from the page seam.
Style/medium: polished 2D Japanese anime game asset, light visual novel background quality, clean and readable.
Composition/framing: ritual objects occupy the lower center, forest depth remains simple, landscape 1536x1024 with UI-safe negative space.
Lighting/mood: curious, damp, quiet, gently magical; not ominous.
Color palette: moss green, warm mushroom gold, pale purple paper, dark bark brown, small star-yellow highlights.
Materials/textures: old paper, glass, bark, mushroom caps; keep textures simple.
Constraints: no characters, no readable text, no watermark, no logo; must feel like a magical forest divination scene, not a generic wizard desk.
Avoid: dense rune walls, big magic circles, cluttered potion shelves, realistic mushrooms, western fantasy wizard symbols.
```

### 3. 命莲寺仪式图

建议文件名：

```text
myouren-temple-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Myouren Temple, focused on temple scroll divination.
Scene/backdrop: a quiet temple approach with blue-gray stone path, warm temple lantern light, a simple wooden veranda edge, and a soft evening sky.
Subject: a small sutra scroll stand, warm temple lantern, plain wooden mokugyo, short warm-white lotus-pattern fortune papers, a partially opened scroll, and a few falling petals.
Style/medium: polished 2D Japanese anime game asset, clean layered UI-friendly illustration.
Composition/framing: scroll stand and lantern in the foreground, stone path and temple hints in the background, landscape 1536x1024.
Lighting/mood: steady, reverent, warm, slightly nocturnal but readable.
Color palette: warm ivory, lantern amber, muted teal-blue stone, pale lotus pink, soft wood brown.
Materials/textures: paper scroll, wood, stone, lantern paper; low texture density.
Constraints: no characters, no readable text, no watermark, no logo; should feel like a Buddhist temple ritual, not a shrine bell scene.
Avoid: oversized Buddha statues, dense incense smoke, generic Chinese palace visuals, horror atmosphere, photorealism.
```

### 4. 三途川仪式图

建议文件名：

```text
sanzu-river-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Sanzu River, focused on quiet river-crossing divination.
Scene/backdrop: a still misty riverbank, calm gray-blue water, low fog, small shore stones, and a few red spider lilies.
Subject: a plain wooden fortune box placed beside a small un-sailed ferry boat, an old oar, several ferry coins, gray-blue damp-looking fortune slips, and one slip reflected on the water surface.
Style/medium: polished 2D Japanese anime game asset, restrained and atmospheric.
Composition/framing: ferry edge and fortune box in lower center, river and fog in midground, landscape 1536x1024 with UI-safe space.
Lighting/mood: very quiet, boundary-like, almost windless, melancholy but not frightening.
Color palette: gray-blue water, pale fog, muted wood, red spider lily accents, soft white paper.
Materials/textures: damp paper, old wood, coins, water surface; keep detail restrained.
Constraints: no characters, no readable text, no watermark, no logo; emphasize no wind and slow water.
Avoid: skulls, horror ghosts, dramatic storm, fantasy boat with sails, crowded flowers, photorealistic river.
```

### 5. 人间之里仪式图

建议文件名：

```text
human-village-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Human Village, focused on everyday street-corner divination.
Scene/backdrop: a modest village shopfront corner with a low wooden counter, cloth notice board, paper lantern glow, and a narrow quiet alley.
Subject: a small wooden fortune drawer, old account book, blank cloth notice papers, simple shop sign shape without readable text, warm lantern, cream short fortune slips, and a paper corner lifted by street wind.
Style/medium: polished 2D Japanese anime game asset, cozy visual novel background style.
Composition/framing: fortune drawer in the lower center, shopfront details around it, enough negative space for UI text, landscape 1536x1024.
Lighting/mood: warm, daily, approachable, slightly mysterious through a just-left shadow in the alley.
Color palette: warm ivory, lantern amber, faded wood brown, muted teal accent, soft street dust.
Materials/textures: old wood, paper, cloth, lantern paper; simple and clean.
Constraints: no characters, no readable text, no watermark, no logo; must feel like a lived-in village, not a tourist street.
Avoid: modern signs, crowds, marketplace clutter, shrine bells, photorealistic street photo.
```

### 6. 向日葵田仪式图

建议文件名：

```text
sunflower-field-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Sunflower Field, focused on seasonal anomaly divination.
Scene/backdrop: a bright sunflower field edge with a weathered wooden sign, soft summer wind, and clear daylight.
Subject: a small fortune box under the old wooden sign, a slightly old parasol leaning beside it, pale gold short fortune slips, sunflower petals, and a subtle shadow on the ground that lags behind the objects.
Style/medium: polished 2D Japanese anime game asset, bright but not tourist-poster-like.
Composition/framing: fortune box and parasol in foreground, sunflower rows as simple background rhythm, landscape 1536x1024.
Lighting/mood: sunny, seasonal, beautiful, with a faint uncanny anomaly.
Color palette: sunflower yellow, leaf green, pale gold paper, warm wood, soft sky blue.
Materials/textures: paper, wood, parasol fabric, petals; avoid dense texture.
Constraints: no characters, no readable text, no watermark, no logo; keep the shadow mismatch subtle and elegant.
Avoid: travel advertisement composition, crowded flower sea, huge fantasy sunbeam, photorealistic flowers, horror tone.
```

### 7. 雾之湖仪式图

建议文件名：

```text
misty-lake-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Misty Lake, focused on cool fog-and-water divination.
Scene/backdrop: a quiet lake shore stone, low horizontal mist, clear cold water ripples, and a distant faint mansion silhouette that does not dominate the scene.
Subject: a shallow wooden tray resting on the shore stone, thin ice along the tray edge, pale blue semi-transparent fortune slips, small ice crystals, one tiny fairy-like light mote, and water ripples spreading from the center.
Style/medium: polished 2D Japanese anime game asset, crisp and UI-friendly.
Composition/framing: tray and slips in lower center, misty lake in the background, landscape 1536x1024.
Lighting/mood: clear, cool, refreshing, slightly cold but gentle.
Color palette: pale blue, white mist, soft wood, tiny cyan sparkles, faint rose-gray distant accent.
Materials/textures: thin ice, water, paper, shore stone; low detail density.
Constraints: no characters, no readable text, no watermark, no logo; lake fog must be the main identity.
Avoid: dominant Red Devil Mansion, heavy snowstorm, horror fog, realistic lake photo, big fairy character.
```

### 8. 无名之丘仪式图

建议文件名：

```text
nameless-hill-ritual-kit-v1.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Create a clean anime-style ritual kit for Nameless Hill, focused on forgotten lily-of-the-valley divination.
Scene/backdrop: a cold dim hill slope with sparse grass, low ground fog, small lily-of-the-valley silhouettes, and weak sunlight.
Subject: a small unlabeled glass bottle half-buried in grass, faded cord around the bottle mouth, gray-white short fortune slips, pale green lily-of-the-valley shadow marks, and a blank erased-name space on the paper.
Style/medium: polished 2D Japanese anime game asset, restrained and delicate.
Composition/framing: glass bottle and fortune slips in lower center, hillside receding quietly, landscape 1536x1024.
Lighting/mood: forgotten, still, cold, poisonous but not horror.
Color palette: gray white, muted green, pale beige, cool shadow blue, faint glass highlight.
Materials/textures: glass, paper, grass, ground fog; simple texture only.
Constraints: no characters, no readable text, no watermark, no logo; emphasize stillness and no wind.
Avoid: dramatic storm, skull imagery, abandoned city ruins, dense flower field, photorealistic macro photo.
```

### 9. 地灵殿仪式图二次打磨

当前已有候选文件：

```text
palace-of-earth-spirits-ritual-kit-v1.png
```

只有当现有图不够清晰时再生成 v2。建议文件名：

```text
palace-of-earth-spirits-ritual-kit-v2.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Refine the Palace of Earth Spirits ritual kit into a clearer underground mind-reading divination scene.
Scene/backdrop: a sealed underground stone hall, low square tiles, small translucent floor bricks, old hell ember glow, sparse pipes or cables, and only a few faint earth-spirit motes.
Subject: a simple black wooden fortune box with a third-eye motif, dark red-purple fortune slips, one small bird-pattern floor tile nearby, a tiny coal brazier, and warm ember light under the paper.
Style/medium: polished 2D Japanese anime game asset, clean layered composition, no photorealism.
Composition/framing: ritual box in foreground, sealed hall in background, enough negative space for UI text, landscape 1536x1024.
Lighting/mood: enclosed, inward-facing, hushed, slightly oppressive but readable.
Color palette: soot gray, muted brick red, warm ember orange, dark purple paper, faint teal spirit light.
Materials/textures: stone, soot, paper, black wood, metal pipe; keep texture density low.
Constraints: no characters, no readable text, no watermark, no logo; clearly not Red Devil Mansion and not a generic hell castle.
Avoid: gothic exterior, city walls, crowds, western occult symbols, bright portals, photorealism.
```

### 10. 守矢神社仪式图二次打磨

当前已有候选文件：

```text
moriya-shrine-ritual-kit-v1.png
```

只有当需要更贴近正式路线时再生成 v2。建议文件名：

```text
moriya-shrine-ritual-kit-v2.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Refine Moriya Shrine ritual kit for a mountain shrine wind-priestess omikuji route.
Scene/backdrop: a high mountain shrine corner, shimenawa rope, white paper shide, a hint of onbashira-like wood posts, and moving cloud shadows.
Subject: wind-priestess bell, shimenawa fortune rack, pale green-and-white scroll fortune slips, frog and snake pattern embossing, diagonal mountain leaves, and tiny miracle particles sliding along the rope.
Style/medium: polished 2D Japanese anime game asset, clean and bright.
Composition/framing: ritual rack and bell in foreground, mountain shrine hints behind, landscape 1536x1024.
Lighting/mood: open, windy, fresh, more expansive than Hakurei Shrine.
Color palette: fresh green, white paper, light wood, pale sky blue, small gold miracle glints.
Materials/textures: rope, paper, wood, bell metal; minimal texture.
Constraints: no characters, no readable text, no watermark, no logo; must be distinct from Hakurei Shrine.
Avoid: generic shrine recolor, crowded festival stall, heavy fantasy magic, photorealism.
```

### 11. 白玉楼仪式图二次打磨

当前已有候选文件：

```text
hakugyokurou-ritual-kit-v1.png
```

只有当需要更贴近正式路线时再生成 v2。建议文件名：

```text
hakugyokurou-ritual-kit-v2.png
```

Prompt：

```text
Use case: stylized-concept
Asset type: Touhou-inspired ritual kit preview image for a web omikuji route
Primary request: Refine Hakugyokurou ritual kit for a netherworld cherry garden divination route.
Scene/backdrop: a quiet cherry garden veranda, pale stone steps, thin mist, and soft moonlit petals.
Subject: white wooden fortune stand with carved rail details, semi-transparent pale pink and silver fortune paper, drifting cherry petals, a clean sword-light streak crossing the paper, and faint glowing ripples on the slip.
Style/medium: polished 2D Japanese anime game asset, elegant and readable.
Composition/framing: fortune stand in foreground, cherry courtyard depth behind, landscape 1536x1024.
Lighting/mood: quiet, empty, graceful, not dead or scary.
Color palette: pale cherry pink, silver white, soft lavender, moonlit blue, clean wood.
Materials/textures: translucent paper, wood, petals, stone; keep detail restrained.
Constraints: no characters, no readable text, no watermark, no logo; convey netherworld elegance through petals and sword-light, not horror.
Avoid: graveyard horror, blood, crowded petals, generic pink shrine, photorealism.
```

## 二、场景背景二次修订提示词

这些图用于 `SCENE_CANDIDATES[].sceneImage`。保存目录统一为：

```text
public/images/generated-themes/expanded/
```

当前已经有 `palace-of-earth-spirits-scene-v3.png`、`divine-spirit-mausoleum-scene-v2.png`、`forest-of-magic-scene-v2.png`、`human-village-scene-v2.png`、`misty-lake-scene-v2.png`、`myouren-temple-scene-v2.png`、`nameless-hill-scene-v2.png`、`sunflower-field-scene-v2.png`。进入本节前必须先完成上文“OOC 审查任务流”：除非现有图明显不够用、地点辨识度不足，或旧背景尚未有可用 v2，否则优先补动画拆层和必要的 `ritualImage` 微调，不要频繁替换背景。

### A. 魔法森林背景 v2

建议文件名：

```text
forest-of-magic-scene-v2.png
```

Prompt：

```text
Create a bright, clean Japanese anime visual novel background for the Forest of Magic. Show a damp old forest path with large tree roots, a few glowing mushrooms, sparse floating spores, a small abandoned object half-hidden near the roots, and deep but readable green-purple shadows. Keep the scene uncluttered and UI-safe, with open space for text overlays. No characters, no readable text, no watermark, no photorealism. Avoid generic fairy forest, dense rune magic, western wizard towers, and excessive glowing effects.
```

### B. 命莲寺背景 v2

建议文件名：

```text
myouren-temple-scene-v2.png
```

Prompt：

```text
Create a bright, clean Japanese anime visual novel background for Myouren Temple. Show a calm temple approach with blue-gray stone path, warm lanterns, understated wooden architecture, a distant main hall silhouette, a small lotus motif, and light evening air. Keep the composition open for UI overlays. No characters, no readable text, no watermark, no photorealism. Avoid generic shrine gates, Chinese palace clutter, huge Buddha statues, horror fog, or dense decorations.
```

### C. 三途川背景 v2

建议文件名：

```text
sanzu-river-scene-v2.png
```

Prompt：

```text
Create a bright but restrained Japanese anime visual novel background for Sanzu River. Show a quiet windless river, low gray-blue fog, plain ferry boat without sails, small shore stones, sparse red spider lilies, still water with almost no waves, and a far bank that feels unreachable. Leave clear UI-safe negative space. No characters, no readable text, no watermark, no photorealism. Avoid horror skulls, dramatic ghosts, stormy water, fantasy pirate boats, and crowded flower fields.
```

### D. 雾之湖背景 v2

建议文件名：

```text
misty-lake-scene-v2.png
```

Prompt：

```text
Create a bright, clean Japanese anime visual novel background for Misty Lake. Show cold clear lake water, horizontal mist layers, a small shore stone, thin water ripples, a few ice crystal sparkles, and a very faint distant mansion silhouette that stays secondary. Leave space for UI text overlays. No characters, no readable text, no watermark, no photorealism. Avoid making Red Devil Mansion the main subject, avoid heavy snowstorm, horror fog, or realistic lake photography.
```

### E. 无名之丘背景 v2

建议文件名：

```text
nameless-hill-scene-v2.png
```

Prompt：

```text
Create a restrained Japanese anime visual novel background for Nameless Hill. Show a cold hill slope with sparse grass, low ground fog, a small patch of lily-of-the-valley silhouettes, weak sunlight, and an eerie stillness with no visible wind. Keep the image clean and UI-safe, not gloomy black. No characters, no readable text, no watermark, no photorealism. Avoid dramatic ruins, graveyard horror, dense flower meadow, storm clouds, or realistic macro flowers.
```

## 三、落地接入说明

2026-05-25 收口状态：

- 14 个场景的静态仪式预览图已落盘，`SCENE_CANDIDATES[].ritualImage` 继续只用于候选预览和生图参考。
- 14 个场景的动画拆层素材包已落盘，并通过 `ritualAssets` 接入类型、路线配置、候选配置、抽签道具和结果签面角标；任务 D 后，14 个场景都已经成为正式可选签路。
- `scarlet/result-corner.png` 与 `eientei/result-corner.png` 已补强为非空透明角标。
- 地灵殿静态预览图已统一命名为 `palace-of-earth-spirits-ritual-kit-v1.png`。
- 旧版森林、命莲寺、雾之湖、无名之丘和地灵殿 v2 背景已归档到 `public/images/generated-themes/legacy/unused-2026-05-25/expanded/`。
- 当前进行中：新增 11 个正式场景的运行界面文案润色。目标是删除“候选、后续、蓝图、待接入”等工程说明口吻，让它们与博丽神社、红魔馆、永远亭一样像真实抽签入口。

后续 AI 使用顺序：

1. 正式抽签动画优先读取 `ritualAssets`，不要把 `*-ritual-kit-v1.png` 当作动画拆层。
2. 候选预览和蓝图说明继续读取 `ritualImage`。
3. 需要重做某一层时，只替换对应场景目录里的单层 PNG，并保留 `source-sheet-v1.png` 作为重切参考。
4. 旧素材不要重新接回 `SCENE_CANDIDATES`；确需回看时从 `legacy/unused-2026-05-25/` 查找。

生成并筛选图片后，按以下方式接入：

1. 将最终 PNG 复制到对应目录。
   - 仪式素材：`public/images/generated-themes/expanded/rituals/`
   - 场景背景：`public/images/generated-themes/expanded/`
2. 不覆盖旧图，优先使用 `-v2`、`-v3` 或 `-ritual-kit-v1`、`-ritual-kit-v2` 版本号。
3. 仪式图接入位置：在 `src/constants/fortune.ts` 的对应 `SCENE_CANDIDATES` 项中添加或更新：

```ts
ritualImage: "/images/generated-themes/expanded/rituals/<file-name>.png",
```

4. 场景背景接入位置：在同一候选项中更新：

```ts
sceneImage: "/images/generated-themes/expanded/<file-name>.png",
```

5. 文档同步：
   - 更新 `docs/后续计划.md` 中的素材清单、任务 C 状态和下一步优先级。
   - 如果新增了更好的背景版本，记录旧图只作为参考，不再接入主配置。
6. 每次接入后至少运行：

```powershell
cmd /c npm.cmd run lint
cmd /c npm.cmd run build
```

7. 资产引用审计建议：

```powershell
cmd /c node -e "const fs=require('fs'); const path=require('path'); const src=fs.readFileSync('src/constants/fortune.ts','utf8'); const refs=[...src.matchAll(/\"(\/images\/generated-themes\/[^\"]+)\"/g)].map(m=>m[1]); const missing=refs.filter(ref=>!fs.existsSync(path.join('public', ref.replace(/^\\//,'')))); console.log(JSON.stringify({count: refs.length, missing}, null, 2)); process.exit(missing.length ? 1 : 0);"
```

8. UI 回归重点：
   - 主页候选场景列表是否能显示新增 `ritualImage` 文件名。
   - 1440px 桌面和 375px 移动端是否无横向溢出。
   - 新图是否被文字遮罩压得过暗或过亮。
   - 候选卡片是否还能一眼区分不同地点，而不是都变成泛用幻想素材。

