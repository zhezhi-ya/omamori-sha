# 五 AI 并行优化分工手册

本文用于把 `御守社` 的后续优化拆给五个 AI 并行执行。目标不是让五个 AI 各自自由发挥，而是让它们在同一套项目语境、素材风格、文件边界和验收规则下分头推进，最后能合并成一个统一的版本。

请每个 AI 在开始前先读完本文，再读自己负责区域列出的输入文件。除非自己的任务明确允许，不要跨到其他 AI 的文件范围里修改。

## 一、共同项目语境

`御守社` 是东方 Project 同人风格的抽签网页。当前重点不是“再做一个抽签按钮”，而是把它推进成有地点气质、有仪式差异、有签文口吻、有收藏回看价值的沉浸式网页。

核心体验应保持：

- 先选择一处幻想乡地点。
- 进入对应场景。
- 以该地点特有的仪式抽签。
- 展示带地点语气、角色气质和签面主题的结果。
- 可回看、收藏、筛选签册。

当前正式路线已有 14 处：

| 路线 ID | 名称 | 当前定位 |
| --- | --- | --- |
| `hakurei` | 博丽神社 | 参拜式，铃绳、赛钱箱、旧木匣、御札、结界回声 |
| `scarlet` | 红魔馆 | 茶会式，银托盘、红茶、玫瑰、窗纱、怀表或餐具轻响 |
| `eientei` | 永远亭 | 问药式，药签匣、药包、月兔脚步、竹影、纸门 |
| `moriya-shrine` | 守矢神社 | 风祝式，风祝铃、注连绳、纸垂、卷轴签、奇迹粒子 |
| `hakugyokurou` | 白玉楼 | 幽冥式，樱庭签台、半透明冥签、樱花、冷色刀光 |
| `forest-of-magic` | 魔法森林 | 魔导式，魔导书、蘑菇、玻璃瓶、星屑纸符、孢子光 |
| `myouren-temple` | 命莲寺 | 寺院式，经卷签台、寺院灯、木鱼、莲纹短签、落花 |
| `palace-of-earth-spirits` | 地灵殿 | 心读式，第三只眼签匣、煤火、地底回声、旧地狱封闭感 |
| `sanzu-river` | 三途川 | 渡河式，渡船签盒、旧船桨、摆渡钱、水面倒影、河雾签 |
| `misty-lake` | 雾之湖 | 冰雾式，浅木托盘、薄冰、半透明短签、水纹、妖精光点 |
| `human-village` | 人间之里 | 街巷式，木抽屉、灯笼、账册、布告、街风翻签 |
| `sunflower-field` | 向日葵田 | 季节异变式，旧木牌、小签箱、阳伞、花瓣、慢半拍影子 |
| `divine-spirit-mausoleum` | 神灵庙 | 道场式，供案、玉笏、铜铃、道符、青白灵签、八角光阵 |
| `nameless-hill` | 无名之丘 | 遗忘式，无标签玻璃瓶、灰白短签、铃兰影、贴地薄雾 |

共同风格底线：

- 明亮、干净、日式二次元、视觉小说式场景。
- 场景要有地点辨识度，不允许只换颜色。
- 不使用真实照片作为运行页面背景。
- 不用角色人物图片撑氛围，重点放在地点、道具、纸张、声音和抽签仪式。
- 不回退到线条图标、抽象几何图形或泛用奇幻城堡。
- 每个地点都应有明确的道具、声音、纸张、风向，以及一处轻微不合常理的小细节。
- 文案不能现代鸡汤化。每条签文或阶段文案都应尽量包含角色专属动作、地点物件或口吻拐点。

## 二、当前问题与扩展方向

五个 AI 的任务都围绕以下问题展开。不要把这些问题理解成必须一次性全部修完，而是把它们作为后续优化的共同地图。

### 1. 内容密度不均

签文数量明显不平衡：

| 路线 | 当前签文数 | 风险 |
| --- | ---: | --- |
| `hakurei` | 19 | 可作为成熟样本 |
| `scarlet` | 14 | 基本可用 |
| `eientei` | 16 | 基本可用 |
| `moriya-shrine` | 19 | 可作为成熟样本 |
| `hakugyokurou` | 6 | 需要补齐 |
| `forest-of-magic` | 4 | 需要优先补齐 |
| `myouren-temple` | 14 | 基本可用 |
| `palace-of-earth-spirits` | 10 | 可继续加厚 |
| `sanzu-river` | 14 | 基本可用 |
| `misty-lake` | 6 | 需要补齐 |
| `human-village` | 18 | 可作为成熟样本 |
| `sunflower-field` | 2 | 最高优先级补齐 |
| `divine-spirit-mausoleum` | 5 | 需要优先补齐 |
| `nameless-hill` | 1 | 最高优先级补齐 |

最低阶段目标：每条路线不少于 12 条签文。

较好阶段目标：每条路线 16 到 24 条签文，并覆盖不同签运等级、情绪、行动建议和收藏价值。

### 2. 路线文案口吻仍偏粗

当前 `textTone` 维度只有 `shrine`、`mansion`、`moon` 三类，无法承载 14 个地点的口吻差异。后续应逐步扩展到路线级口吻或更细的 `ritualTone`，让结果签面、阶段提示、按钮状态、签册摘要都能说同一种地点语言。

### 3. README 与页面元信息可能落后

代码与文档已经扩展到 14 路线，但 README 或 metadata 仍可能出现“三条路线”这类旧描述。后续应统一为 14 处正式签路，同时保留“同人风格”“非官方二次创作”的说明。

### 4. 抽签流程稳定性有隐患

需要重点检查：

- `omamoriAudio.unlock()` 是否可能导致抽签流程卡住。
- “今日签文”的语义是否被随机逻辑破坏。
- 音频失败、资源缺失、浏览器自动播放限制下是否仍可完成抽签。
- 动画关闭、减弱动效、移动端窄屏、触摸操作下是否仍顺畅。

### 5. 素材体量与发布风险

当前 `public/images` 与 `public/audio` 体量较大，约 219MB。后续要做索引、引用审计、压缩策略和发布包检查。不要盲目继续生成大图。

### 6. 合规说明需要落地

公开发布前必须遵守东方 Project 二次创作基本原则：

- 明确标注这是东方 Project 二次创作。
- 不得让人误认为官方内容。
- 不得使用或公开原作游戏素材。
- 浏览器或手机游戏类同人内容原则上免费发布。

## 三、并行协作总规则

五个 AI 必须遵守这些规则，避免互相覆盖。

### 1. 文件所有权

每个 AI 只修改自己负责的文件。需要跨区修改时，先在完成报告里提出“请求 AI-X 处理”，不要直接改对方核心文件。

例外：AI-5 是总集成与验收，可以做少量跨文件修复，但必须在报告里写清楚原因、影响和回归验证结果。

### 2. 共享只读文件

以下文件所有 AI 都可以读取，但不能随意修改：

- `docs/后续计划.md`
- `docs/gpt-image-2-素材提示词.md`
- `src/types/omikuji.ts`
- `src/constants/fortune.ts`
- `content/omikuji/fortunes.json`
- `package.json`
- `README.md`

如果自己的任务明确要求修改其中某个文件，以自己的“允许修改文件”列表为准。

### 3. 禁止跨域改动

- AI-1 不改 UI、算法、音频、素材配置。
- AI-2 不改签文数据、不新增素材、不改抽签算法。
- AI-3 不改签文正文、不重写路线世界观、不新增大素材。
- AI-4 不改签文正文、不改抽签核心逻辑、不把 `legacy/` 重新接入主配置。
- AI-5 不主动重写其他 AI 的核心产出，只做验收、协调、轻量修复和发布说明。

### 4. 风格一致性

新增内容必须与现有风格一致：

- 签文参考已有成熟路线的结构，但不能复制套壳。
- 文案保持温柔、轻灵、略带东方同人气质，不写现代职场鸡汤。
- 素材遵循 `docs/gpt-image-2-素材提示词.md`，优先小范围补层，不重做整套。
- UI 改动要延续现有视觉小说式场景体验，不把页面改成管理后台或普通卡片列表。

### 5. 修改顺序

每个 AI 开工后按这个顺序：

1. 读本文。
2. 读自己的输入文件。
3. 用搜索确认自己负责文件里的现状。
4. 列出本 AI 的小计划。
5. 只改自己的文件范围。
6. 跑自己负责的验证命令。
7. 输出完成报告。

### 6. 完成报告格式

每个 AI 完成后都按这个格式报告：

```text
AI 编号：
负责方向：
改动文件：
完成内容：
主动避开的文件：
验证命令与结果：
仍需其他 AI 配合：
风险与建议：
```

## 四、共享技术地图

### 关键代码位置

| 文件 | 作用 |
| --- | --- |
| `src/types/omikuji.ts` | 路线、签文、记录、收藏等类型 |
| `src/constants/fortune.ts` | 路线配置、场景蓝图、文案标签、阶段文案、候选素材 |
| `content/omikuji/fortunes.json` | 签文数据源 |
| `src/lib/fortune-engine.ts` | 抽签、筛选、权重、每日签逻辑 |
| `src/lib/audio.ts` | 音频解锁与播放 |
| `src/store/omamori-store.ts` | 当前路线、设置、今日抽签、收藏状态 |
| `src/components/daily-draw-panel.tsx` | 主入口、路线选择、抽签流程 |
| `src/components/shrine-scene.tsx` | 抽签场景外壳 |
| `src/components/fortune-card.tsx` | 结果签面 |
| `src/components/fortune-tube.tsx` | 仪式道具动画 |
| `src/components/collection-list.tsx` | 签册与筛选 |
| `src/components/settings-modal.tsx` | 设置弹窗 |
| `public/images/generated-themes/` | 场景、仪式、拆层素材 |
| `public/audio/` | 音频素材 |

### 常用验证命令

Windows 当前环境使用 PowerShell 时，第一次输出前先执行：

```powershell
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
```

基础验证：

```powershell
cmd /c npm.cmd run lint
cmd /c npx.cmd tsc --noEmit
cmd /c npm.cmd run build
```

签文路线数量审计：

```powershell
node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync('content/omikuji/fortunes.json','utf8'));const routes=['hakurei','scarlet','eientei','moriya-shrine','hakugyokurou','forest-of-magic','myouren-temple','palace-of-earth-spirits','sanzu-river','misty-lake','human-village','sunflower-field','divine-spirit-mausoleum','nameless-hill'];const counts=Object.fromEntries(routes.map(route=>[route,0]));for(const fortune of data){for(const route of fortune.relatedSceneIds||[])if(route in counts)counts[route]+=1;}console.table(Object.entries(counts).map(([route,count])=>({route,count})));if(Object.values(counts).some(count=>count<12))process.exit(1);"
```

签文字段完整性审计：

```powershell
node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync('content/omikuji/fortunes.json','utf8'));const required=['id','category','tier','title','character','summary','advice','luckyColor','luckyItem','tags','rarity','relatedSceneIds'];const issues=[];const ids=new Set();for(const fortune of data){if(ids.has(fortune.id))issues.push({id:fortune.id,issue:'duplicate id'});ids.add(fortune.id);for(const key of required){if(fortune[key]===undefined||fortune[key]===null||fortune[key]===''||(Array.isArray(fortune[key])&&fortune[key].length===0))issues.push({id:fortune.id,issue:'missing '+key});}}console.table(issues);if(issues.length)process.exit(1);"
```

权重审计：

```powershell
node -e "const fs=require('fs');const data=JSON.parse(fs.readFileSync('content/omikuji/fortunes.json','utf8'));const rarity={common:58,uncommon:24,rare:10,epic:5,legendary:2};const category={study:1,love:1,slacking:.94,lateNight:.9,social:.95,wealth:.75,hidden:.18};const bad=data.filter(f=>!Number.isFinite(rarity[f.rarity]*category[f.category])).map(f=>({id:f.id,category:f.category,rarity:f.rarity}));console.table(bad);if(bad.length)process.exit(1);"
```

素材引用审计：

```powershell
node -e "const fs=require('fs');const path=require('path');const src=fs.readFileSync('src/constants/fortune.ts','utf8');const refs=[...src.matchAll(/['\"](\/images\/[^'\"]+)['\"]/g)].map(m=>m[1]);const missing=refs.filter(ref=>!fs.existsSync(path.join('public',ref.replace(/^\/images\//,'images/'))));console.table(missing.map(ref=>({missing:ref})));if(missing.length)process.exit(1);"
```

公开包体积概览：

```powershell
node -e "const fs=require('fs');const path=require('path');function walk(dir){let total=0,files=[];for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);const s=fs.statSync(p);if(s.isDirectory()){const r=walk(p);total+=r.total;files=files.concat(r.files);}else{total+=s.size;files.push({path:p,size:s.size});}}return{total,files};}for(const dir of ['public/images','public/audio']){if(!fs.existsSync(dir))continue;const r=walk(dir);console.log(dir, (r.total/1024/1024).toFixed(2)+'MB');console.table(r.files.sort((a,b)=>b.size-a.size).slice(0,20).map(f=>({path:f.path,sizeMB:(f.size/1024/1024).toFixed(2)})));}"
```

### 外部事实查证

涉及东方设定、二创规则、角色口吻、地点设定时，不要凭印象直接写死。优先查：

- `https://thbwiki.cc/`
- Touhou Wiki
- 东方 Project 官方或官方授权资料
- 东方 Project 二次创作指南：`https://touhou-project.news/guideline/`

如果无法联网，必须在报告里标明“未能外部查证”，并把新增内容写得保守，避免使用不确定设定。

## 五、AI-1：签文与东方口吻扩充

### 负责人定位

AI-1 负责把签文库补厚、去模板化、校准角色口吻。它是内容侧主力，只处理 `content/omikuji/fortunes.json` 和签文审计说明，不处理 UI、素材和抽签算法。

### 主要目标

1. 把薄弱路线补到至少 12 条签文。
2. 优先补齐：
   - `nameless-hill`
   - `sunflower-field`
   - `forest-of-magic`
   - `divine-spirit-mausoleum`
   - `hakugyokurou`
   - `misty-lake`
3. 每条新签文至少包含一个地点物件、一个角色气质或一个仪式动作。
4. 避免批量复用同一句式。
5. 保持 JSON 结构稳定，不引入新字段，除非 AI-5 已统一协调。

### 输入文件

必须读取：

- `docs/后续计划.md`
- `content/omikuji/fortunes.json`
- `src/types/omikuji.ts`
- `src/constants/fortune.ts`

建议读取：

- `docs/gpt-image-2-素材提示词.md`

### 允许修改文件

- `content/omikuji/fortunes.json`
- `docs/后续计划.md` 中与签文数量、签文质量相关的小节

### 禁止修改文件

- `src/components/*`
- `src/lib/fortune-engine.ts`
- `src/lib/audio.ts`
- `src/store/omamori-store.ts`
- `public/images/*`
- `public/audio/*`
- `src/constants/fortune.ts`

### 签文写作规格

每条签文应满足：

- `id` 唯一，命名延续现有规则。
- `relatedSceneIds` 至少包含一个正式路线 ID。
- `title` 不能像通用鸡汤标题。
- `summary` 是短句，适合结果卡片扫读。
- `body` 要像一段从地点仪式里递出的签。
- `advice` 给出可执行的小动作，不写空泛鼓励。
- `luckyItem` 与地点、角色或日常动作有关。
- `tags` 可用于后续筛选，保持简短。
- `weight` 使用现有范围，不做极端权重。

去模板化要求：

- 不连续使用“今天适合”“你不必”“先把”这类结构。
- 不把角色名当装饰贴上去，必须体现动作或口吻。
- 不写“宇宙”“命运能量”“灵魂频率”等泛用玄学词，除非该路线确实适合且表达克制。
- 不写官方角色台词的直接引用。
- 不引入过强恋爱、暴力、恐怖或成人化内容。

路线口吻参考：

| 路线 | 签文质感 |
| --- | --- |
| `hakurei` | 直白、干净、略懒散，但会把关键处点醒 |
| `scarlet` | 优雅、任性、像茶会上的一句挑剔提醒 |
| `eientei` | 问诊、配药、月光、温柔但不含糊 |
| `moriya-shrine` | 山风、奇迹、现代神社感，行动感强 |
| `hakugyokurou` | 樱、幽冥、慢一拍，温柔中有锋利边缘 |
| `forest-of-magic` | 试验、魔导书、蘑菇、失败后再试一次 |
| `myouren-temple` | 寺院、经卷、船影、宽和但有规矩 |
| `palace-of-earth-spirits` | 地底、读心、煤火，直面被藏起来的念头 |
| `sanzu-river` | 渡船、河雾、旧钱，提醒取舍与代价 |
| `misty-lake` | 冰雾、水纹、妖精恶作剧，轻快但别粗心 |
| `human-village` | 街巷、灯笼、账册、邻里烟火气 |
| `sunflower-field` | 阳伞、花影、季节、强烈但从容 |
| `divine-spirit-mausoleum` | 道符、石阶、灵光、古雅秩序 |
| `nameless-hill` | 铃兰、无名、遗忘、安静回收旧事 |

### 推荐执行步骤

1. 统计每条路线现有数量。
2. 先读薄弱路线已有签文，提炼它们的字段风格。
3. 为每条薄弱路线列 8 到 12 个签文意图，不要直接批量写正文。
4. 分批新增 JSON 项，每批后运行字段审计。
5. 检查标题、summary、body 是否重复套路。
6. 再运行数量审计和权重审计。
7. 更新 `docs/后续计划.md` 中签文数量状态。

### 验收标准

- `content/omikuji/fortunes.json` 是合法 JSON。
- 所有正式路线不少于 12 条签文。
- 无重复 `id`。
- 无空字段。
- `weight` 合法。
- `npm run lint` 不因 JSON 或导入报错。
- 新签文读起来不像同一模板批量替换名词。

### AI-1 完成报告重点

报告必须列出：

- 每条路线新增数量。
- 每条薄弱路线最终总数。
- 主动删除或改写的重复句式。
- 哪些东方设定已查证，哪些未查证。

## 六、AI-2：场景文案与路线语气系统

### 负责人定位

AI-2 负责路线配置、场景阶段文案、结果卡片标签、页面元信息和文档描述统一。它不新增签文正文，也不处理素材生成。

### 主要目标

1. 让 14 条路线的 `copyLabels`、阶段提示、仪式命名和结果标签明显区分。
2. 评估并扩展 `textTone` 或等价路线语气系统，让 14 路线不再挤在 3 个语气里。
3. 同步 README、metadata 或页面描述中落后的“三路线”表述。
4. 保持现有 UI 结构，不进行大型组件重写。

### 输入文件

必须读取：

- `docs/后续计划.md`
- `src/constants/fortune.ts`
- `src/types/omikuji.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `README.md`

建议读取：

- `content/omikuji/fortunes.json`
- `docs/gpt-image-2-素材提示词.md`

### 允许修改文件

- `src/constants/fortune.ts`
- `src/types/omikuji.ts`，仅当扩展语气类型确实需要
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `README.md`
- `docs/后续计划.md`

### 禁止修改文件

- `content/omikuji/fortunes.json`
- `src/components/daily-draw-panel.tsx`
- `src/components/fortune-tube.tsx`
- `src/lib/fortune-engine.ts`
- `src/lib/audio.ts`
- `public/images/*`
- `public/audio/*`

### 文案设计要求

阶段文案要服务抽签流程，不写说明书式文字。好的阶段文案应该像地点本身在发生一件小事。

例：

- 博丽神社：铃绳轻晃，旧木匣里有纸签撞了一下。
- 红魔馆：银托盘停在窗纱边，红茶的热气替你遮住半句答案。
- 永远亭：药签从竹影下滑出，像一张刚写完的方子。

不推荐：

- 请选择你的抽签路线。
- 系统正在生成今日结果。
- 该地点拥有独特的东方风格。

路线语气扩展建议：

可以把 `textTone` 从三类扩展到路线级，例如：

```ts
type OmamoriTextTone =
  | "hakurei"
  | "scarlet"
  | "eientei"
  | "moriya"
  | "hakugyokurou"
  | "forest"
  | "myouren"
  | "earthSpirits"
  | "sanzu"
  | "mistyLake"
  | "humanVillage"
  | "sunflower"
  | "mausoleum"
  | "nameless";
```

如果现有代码使用 `textTone` 的地方很多，也可以保留 `textTone` 粗分类，新增 `ritualTone` 或 `copyTone`。优先选择改动小、类型清晰、不会影响 AI-3 的方案。

### 推荐执行步骤

1. 搜索所有“三条路线”“三处”“3 route”等旧描述。
2. 检查 `src/constants/fortune.ts` 中：
   - `SCENE_BLUEPRINTS`
   - `EXPANDED_ROUTE_COPY_LABELS`
   - `EXPANDED_ROUTE_STAGE_COPY`
   - `OMAMORI_ROUTES`
   - `SCENE_CANDIDATES`
3. 为每条路线建立一行“仪式类型 + 纸张 + 主要道具 + 声音 + 文案动词”。
4. 先更新常量文案，再处理类型。
5. 同步页面 metadata 和 README 的路线数量、非官方说明、公开风险。
6. 运行 TypeScript 检查。

### 验收标准

- 14 条路线都有独立仪式命名和阶段文案。
- 不再出现明显过期的“三路线正式开放”描述。
- 类型检查通过。
- 不需要改签文 JSON。
- 不影响 AI-3 的交互组件。

### AI-2 完成报告重点

报告必须列出：

- 改了哪些路线文案。
- 是否扩展类型，扩展了哪些类型。
- 搜索并修正了哪些旧描述。
- 是否需要 AI-1 依据新语气补签文。

## 七、AI-3：UI、交互、无障碍与抽签稳定性

### 负责人定位

AI-3 负责用户实际点击抽签时是否顺畅、是否可访问、是否能在失败条件下完成。它可以触碰组件、store、engine、audio，但只修行为问题，不做大规模视觉重设和内容扩写。

### 主要目标

1. 修复或兜底 `omamoriAudio.unlock()` 可能导致的流程卡住。
2. 检查“今日签文”语义，避免每日固定签被无意改成纯随机。
3. 改善移动端、键盘操作、ARIA 名称、按钮状态和错误提示。
4. 优化签册筛选、空状态、收藏反馈和设置弹窗可用性。
5. 在音频失败、动效关闭、素材加载慢时仍能完成抽签。

### 输入文件

必须读取：

- `docs/后续计划.md`
- `src/components/daily-draw-panel.tsx`
- `src/components/fortune-tube.tsx`
- `src/components/settings-modal.tsx`
- `src/components/collection-list.tsx`
- `src/components/fortune-card.tsx`
- `src/lib/fortune-engine.ts`
- `src/lib/audio.ts`
- `src/store/omamori-store.ts`
- `src/types/omikuji.ts`

建议读取：

- `src/constants/fortune.ts`
- `content/omikuji/fortunes.json`

### 允许修改文件

- `src/components/daily-draw-panel.tsx`
- `src/components/fortune-tube.tsx`
- `src/components/settings-modal.tsx`
- `src/components/collection-list.tsx`
- `src/components/fortune-card.tsx`
- `src/lib/fortune-engine.ts`
- `src/lib/audio.ts`
- `src/store/omamori-store.ts`
- `src/types/omikuji.ts`，仅当行为修复需要

### 禁止修改文件

- `content/omikuji/fortunes.json`
- `public/images/*`
- `public/audio/*`
- `docs/gpt-image-2-素材提示词.md`
- 大规模重写 `src/constants/fortune.ts` 文案

### 稳定性修复要求

音频解锁兜底建议：

- `unlock()` 不应阻塞抽签主流程。
- 可以使用超时保护，例如 800 到 1500ms 后继续流程。
- 失败时只降级音频，不中断抽签。
- 控制台警告可以保留，但 UI 不要吓用户。

“今日签文”语义建议：

- 如果产品语义是“每天同一路线固定一签”，则随机种子应包含日期和路线。
- 如果产品语义是“每天可抽但每次可能不同”，则 UI 文案不能叫固定今日签。
- 优先保持“今日签文”的稳定语义，因为收藏与日签记录更适合这个模型。

无障碍与交互建议：

- 可点击元素必须有清晰 `aria-label` 或可见文本。
- 抽签按钮在处理中要禁用，防止连点。
- 键盘用户应能选择路线、开始抽签、关闭设置弹窗。
- 弹窗打开后焦点不要丢失。
- 动效关闭时仍应有状态变化。
- 移动端不应出现按钮文字溢出、固定底栏遮挡、卡片压缩不可读。

### 推荐执行步骤

1. 搜索 `unlock`、`daily`、`today`、`random`、`aria`、`disabled`。
2. 复现抽签流程：有音频、无音频、动效关闭、移动端。
3. 先写最小稳定性修复。
4. 再做可访问性和交互小修。
5. 运行 lint、tsc、build。
6. 若能启动本地服务，用浏览器实际点一轮：
   - 选择路线。
   - 抽签。
   - 查看结果。
   - 收藏。
   - 打开签册筛选。
   - 打开设置并关闭。

### 验收标准

- 音频失败不阻断抽签。
- 抽签过程中连点不会产生重复或错乱状态。
- 今日签语义明确且与代码一致。
- 键盘与屏幕阅读器基础可用。
- 移动端主要流程无明显遮挡或溢出。
- lint、tsc、build 通过。

### AI-3 完成报告重点

报告必须列出：

- 修复了哪些流程卡点。
- 今日签语义最终是什么。
- 做过哪些浏览器手动路径。
- 哪些 UI 问题需要 AI-2 或 AI-4 配合。

## 八、AI-4：素材、性能与公开发布包

### 负责人定位

AI-4 负责素材资产、资源体量、引用关系、压缩策略和素材风格一致性。它可以整理素材文档、检查资源引用、提出生成提示词或替换方案，但不能乱改签文和核心逻辑。

### 主要目标

1. 建立素材清单：哪些正在被引用，哪些只是候选，哪些是 legacy。
2. 检查素材缺失、错误引用、重复大图和发布包体积。
3. 制定压缩、尺寸、格式和懒加载策略。
4. 如果需要新增素材，严格沿用 `docs/gpt-image-2-素材提示词.md` 的风格要求。
5. 不把旧 OOC 素材重新接回主配置。

### 输入文件

必须读取：

- `docs/后续计划.md`
- `docs/gpt-image-2-素材提示词.md`
- `src/constants/fortune.ts`
- `public/images/generated-themes/`
- `public/audio/`
- `next.config.ts` 或项目中的 Next 配置文件，如果存在

建议读取：

- `src/components/shrine-scene.tsx`
- `src/components/fortune-tube.tsx`
- `src/components/fortune-card.tsx`

### 允许修改文件

- `docs/gpt-image-2-素材提示词.md`
- `docs/后续计划.md`
- `src/constants/fortune.ts`，仅限修正素材引用路径或切换到已确认素材
- `public/images/generated-themes/`，仅限新增或替换经审查通过的项目自有素材
- `public/audio/`，仅限压缩、替换或补充项目自有素材
- 可新增 `docs/素材资产审计.md`，如果需要单独沉淀资源清单

### 禁止修改文件

- `content/omikuji/fortunes.json`
- `src/lib/fortune-engine.ts`
- `src/store/omamori-store.ts`
- `src/components/daily-draw-panel.tsx`
- `src/components/collection-list.tsx`

### 素材风格硬性要求

新增或替换素材必须满足：

- 明亮、干净、日式二次元游戏资产。
- 与 `public/images/generated-themes/` 现有素材保持一致。
- 不使用真实照片。
- 不出现角色人物。
- 不出现可读文字、水印、Logo。
- 不用复杂纹理、过暗光影、泛用西式魔法阵、泛用奇幻城堡。
- 每张图应有地点辨识物、抽签道具、签纸形态和一处轻微不合常理的小细节。
- 优先保持 UI 文案留白。

素材类型判断：

| 类型 | 优先动作 |
| --- | --- |
| 背景图 | 只有明显 OOC 或缺失时才重做 |
| 静态仪式预览图 | 可生成 v2，但不覆盖 v1 |
| 动画拆层素材包 | 优先补透明拆层，不重画整张背景 |
| 结果角标 | 小体积透明 PNG，避免喧宾夺主 |

特别禁止：

- 不要把 `legacy/` 目录素材重新接回主配置。
- 不要把已被 `v2` 或 `v3` 替代的旧图写回 `SCENE_CANDIDATES`。
- 不要为了“更华丽”重做 active 三路线主背景。
- 不要引入未授权原作截图、游戏拆包素材、官方图。

### 推荐执行步骤

1. 扫描 `src/constants/fortune.ts` 中所有 `/images/` 引用。
2. 对比 `public/images/generated-themes/` 实际文件。
3. 统计 `public/images` 与 `public/audio` 最大文件。
4. 标记资源状态：
   - `active-used`
   - `expanded-used`
   - `candidate-unused`
   - `legacy-reference-only`
   - `missing`
   - `oversized`
5. 先修缺失引用，再处理体积最大且收益明确的素材。
6. 如需生图，先写提示词和 OOC 判断，不直接覆盖旧图。
7. 更新素材文档和后续计划。

### 验收标准

- 运行素材引用审计无缺失。
- 发布包体积变化有说明。
- 新增素材与现有风格一致。
- 文档记录素材状态。
- 无未授权原作素材进入项目。
- 不回接 legacy 或 OOC 旧素材。

### AI-4 完成报告重点

报告必须列出：

- 当前被引用素材总览。
- 最大资源文件与处理建议。
- 新增或替换素材的来源、用途、风格判断。
- 是否需要 AI-2 更新文案或 AI-3 调整加载体验。

## 九、AI-5：验收、安全、合规与总集成

### 负责人定位

AI-5 是最终集成者。它负责跑全量检查、整理合规与发布说明、协调冲突、确认 README 与文档同步。它不是第六个开发者，不应主动抢其他 AI 的核心工作。

### 主要目标

1. 汇总 AI-1 到 AI-4 的完成结果。
2. 检查文件冲突、类型错误、构建错误和文档过期。
3. 修正公开说明、二创声明、非官方声明和免费发布提示。
4. 跑 lint、tsc、build、签文审计、素材审计。
5. 做一轮浏览器手动回归。
6. 输出最终发布前清单。

### 输入文件

必须读取：

- 本文档
- `docs/后续计划.md`
- `docs/gpt-image-2-素材提示词.md`
- `README.md`
- `package.json`
- `src/app/layout.tsx`
- `src/constants/fortune.ts`
- `content/omikuji/fortunes.json`
- AI-1 到 AI-4 的完成报告

建议读取：

- 所有被修改文件的 git diff

### 允许修改文件

- `README.md`
- `docs/后续计划.md`
- `docs/gpt-image-2-素材提示词.md`
- 可新增 `docs/发布验收清单.md`
- 少量修复任何文件中的构建错误、类型错误、路径错误、明显文案冲突

### 禁止修改文件

原则上不主动大改：

- `content/omikuji/fortunes.json`
- `src/components/*`
- `src/lib/*`
- `public/images/*`
- `public/audio/*`

如果必须修，报告里写清楚：

- 为什么必须由 AI-5 修。
- 改了什么。
- 是否可能覆盖其他 AI 意图。
- 如何验证没有回归。

### 合规与安全检查

必须确认：

- README 或页面说明中明确“东方 Project 二次创作”。
- README 或页面说明中明确“非官方”。
- 没有让用户误以为这是官方项目。
- 没有使用原作游戏截图、拆包素材或官方图。
- 公开版本不收费，不设置付费解锁。
- `npm audit` 中若有 Next 内置依赖导致的 PostCSS advisory，不使用 `npm audit fix --force` 强行降级 Next。
- 如安全问题来自框架内置依赖，记录 advisory、当前版本、可行等待路径或升级路径。

### 推荐执行步骤

1. 查看 git diff，按 AI 分区确认改动。
2. 运行签文审计、权重审计、素材引用审计。
3. 运行 lint、tsc、build。
4. 启动本地服务，进行浏览器手动回归：
   - 首屏加载。
   - 14 路线可见。
   - 至少选择 3 条路线抽签。
   - 音频开启与关闭各测一次。
   - 收藏结果。
   - 签册筛选。
   - 设置弹窗。
   - 移动端窄屏。
5. 更新 README 和发布验收清单。
6. 输出最终合并报告。

### 验收标准

- lint 通过。
- tsc 通过。
- build 通过。
- 签文字段审计通过。
- 素材引用审计通过。
- README 与页面元信息不再过期。
- 合规说明清晰。
- 已记录残余风险。

### AI-5 完成报告重点

报告必须列出：

- 全量验证命令与结果。
- 浏览器回归路径。
- 合规检查结果。
- 仍未解决的风险。
- 建议下一轮五 AI 分工。

## 十、冲突处理规则

如果两个 AI 都需要改同一个文件，按以下方式处理：

| 文件 | 主负责人 | 其他 AI 做法 |
| --- | --- | --- |
| `content/omikuji/fortunes.json` | AI-1 | 只读，提出建议 |
| `src/constants/fortune.ts` | AI-2 | AI-4 只能修素材路径，AI-5 只能修集成错误 |
| `src/components/*` | AI-3 | 其他 AI 只读，提出建议 |
| `src/lib/fortune-engine.ts` | AI-3 | AI-5 只修构建或集成错误 |
| `src/lib/audio.ts` | AI-3 | 其他 AI 只读 |
| `public/images/*` | AI-4 | 其他 AI 只读 |
| `public/audio/*` | AI-4 | 其他 AI 只读 |
| `README.md` | AI-2 与 AI-5 | AI-2 更新产品描述，AI-5 更新发布与合规 |
| `docs/后续计划.md` | 五个 AI 可分区更新 | 只更新自己负责小节 |

冲突原则：

- 内容冲突优先保留更贴近项目定位的一方。
- 类型冲突优先保留通过 `tsc` 的最小改动。
- UI 冲突优先保留不破坏现有体验的一方。
- 素材冲突优先保留已在 UI 中验证清晰、体积合理、风格一致的一方。
- 合规冲突优先保留更保守、更清楚声明非官方的一方。

## 十一、素材新增详细教程

新增素材不是“缺什么画什么”。必须按下面流程做。

### 第一步：判断素材类型

先判定目标属于：

1. 背景图。
2. 静态仪式预览图。
3. 动画拆层素材包。
4. 结果签面角标。
5. 音频素材。

不同类型的处理策略不同。最常见的后续需求应该是动画拆层和结果角标，而不是重做背景。

### 第二步：读取现有素材说明

必须先读：

- `docs/gpt-image-2-素材提示词.md`
- `docs/后续计划.md`
- `src/constants/fortune.ts`

确认：

- 现有配置引用哪张图。
- 有没有 `v2` 或 `v3` 替代旧图。
- 旧图是否已进入 `legacy/`。
- 该地点的仪式类型是什么。

### 第三步：做 OOC 审查

如果素材跑偏，先判断是“整体背景跑偏”还是“仪式道具跑偏”。

典型 OOC：

- 地灵殿像红魔馆或地狱城堡，太开放、太哥特。
- 神灵庙像泛用神秘神社，没有道教、陵庙、石阶感。
- 向日葵田像旅游宣传片，缺少季节异变感。
- 人间之里像观光街景，缺烟火气和日常告示。

如果已有修正版：

- `palace-of-earth-spirits-scene-v3.png` 是当前候选。
- `divine-spirit-mausoleum-scene-v2.png` 是当前候选。
- `sunflower-field-scene-v2.png` 是当前候选。
- `human-village-scene-v2.png` 是当前候选。

不要把旧版重新接回。

### 第四步：写提示词

提示词必须说明：

- 用途：背景、静态仪式图、动画拆层、结果角标。
- 场景：路线名和仪式类型。
- 输出：透明 PNG 或横向背景 PNG。
- 风格：明亮、干净、日式二次元游戏资产。
- 构图：给 UI 留白。
- 约束：无人物、无文字、无水印、无 Logo、非照片。
- 避免：复杂纹理、西式奇幻、抽象图标、原作素材。

动画拆层通用提示词：

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

### 第五步：落盘命名

动画拆层素材放在：

```text
public/images/generated-themes/active/rituals/<scene-id>/
public/images/generated-themes/expanded/rituals/<scene-id>/
```

建议命名：

```text
ritual-base.png
paper-closed.png
paper-emerging.png
paper-open.png
fx-particles.png
fx-reveal.png
result-corner.png
```

静态仪式预览图如果需要修订，不覆盖旧文件：

```text
<scene-id>-ritual-kit-v2.png
```

背景修订图不覆盖旧文件：

```text
<scene-id>-scene-v2.png
<scene-id>-scene-v3.png
```

### 第六步：接入与验证

接入后必须：

1. 更新 `src/constants/fortune.ts` 中引用。
2. 更新 `docs/gpt-image-2-素材提示词.md` 的素材状态。
3. 更新 `docs/后续计划.md` 的素材状态。
4. 运行素材引用审计。
5. 浏览器查看对应路线，确认素材不黑屏、不遮挡、不压 UI。

## 十二、五个 AI 的可复制提示词

下面五段可以直接复制给对应 AI。复制时保留文件路径和禁止事项。

### AI-1 提示词：签文与东方口吻扩充

```text
你是 AI-1，负责 H:/Project/御守社 的签文与东方口吻扩充。请全程使用简体中文沟通。先读取 docs/五AI并行优化分工手册.md、docs/后续计划.md、content/omikuji/fortunes.json、src/types/omikuji.ts、src/constants/fortune.ts，再开始工作。

你的目标是只在内容层补强签文库：把 nameless-hill、sunflower-field、forest-of-magic、divine-spirit-mausoleum、hakugyokurou、misty-lake 等薄弱路线补到每条至少 12 条签文；新签文要保持现有 JSON 结构，id 唯一，字段完整，weight 合法。每条新签文至少包含一个地点物件、角色气质或仪式动作，避免现代鸡汤和批量套模板。

你允许修改 content/omikuji/fortunes.json，以及 docs/后续计划.md 中与签文数量和签文质量相关的小节。禁止修改 UI、抽签算法、音频、素材和 src/constants/fortune.ts。

执行步骤：先统计每条路线现有签文数量；再阅读薄弱路线已有签文，提炼风格；为每条薄弱路线先列签文意图，再分批写入 JSON；每批后运行字段完整性、路线数量和权重审计；最后更新 docs/后续计划.md 的签文状态。

验收要求：JSON 合法；所有正式路线不少于 12 条签文；无重复 id；无空字段；weight 为正且不极端；新增内容读起来不像同一模板替换名词。完成报告按“AI 编号、负责方向、改动文件、完成内容、主动避开的文件、验证命令与结果、仍需其他 AI 配合、风险与建议”输出。
```

### AI-2 提示词：场景文案与路线语气系统

```text
你是 AI-2，负责 H:/Project/御守社 的场景文案与路线语气系统。请全程使用简体中文沟通。先读取 docs/五AI并行优化分工手册.md、docs/后续计划.md、src/constants/fortune.ts、src/types/omikuji.ts、src/app/layout.tsx、src/app/page.tsx、README.md，再开始工作。

你的目标是让 14 条正式路线在阶段文案、仪式命名、结果标签和页面描述上明显区分；评估是否需要把 textTone 从 shrine/mansion/moon 扩展为路线级语气，或新增 ritualTone/copyTone；同步修正 README、metadata 或页面里过期的“三路线”描述，并加入清晰的非官方东方 Project 二次创作说明。

你允许修改 src/constants/fortune.ts、必要时小范围修改 src/types/omikuji.ts、src/app/layout.tsx、src/app/page.tsx、README.md、docs/后续计划.md。禁止修改 content/omikuji/fortunes.json、UI 组件、抽签算法、音频和素材文件。

执行步骤：先搜索“三条路线”“三处”“3 route”等旧描述；检查 SCENE_BLUEPRINTS、EXPANDED_ROUTE_COPY_LABELS、EXPANDED_ROUTE_STAGE_COPY、OMAMORI_ROUTES、SCENE_CANDIDATES；为每条路线建立“仪式类型 + 纸张 + 主要道具 + 声音 + 文案动词”；再更新常量文案和必要类型；最后同步 README 与页面元信息。

验收要求：14 条路线都有独立仪式命名和阶段文案；不再出现明显过期的三路线描述；TypeScript 检查通过；不改签文 JSON；不影响 AI-3 的交互组件。完成报告按统一格式输出，并说明是否需要 AI-1 依据新语气补签文。
```

### AI-3 提示词：UI、交互、无障碍与抽签稳定性

```text
你是 AI-3，负责 H:/Project/御守社 的 UI、交互、无障碍与抽签稳定性。请全程使用简体中文沟通。先读取 docs/五AI并行优化分工手册.md、docs/后续计划.md、src/components/daily-draw-panel.tsx、src/components/fortune-tube.tsx、src/components/settings-modal.tsx、src/components/collection-list.tsx、src/components/fortune-card.tsx、src/lib/fortune-engine.ts、src/lib/audio.ts、src/store/omamori-store.ts、src/types/omikuji.ts，再开始工作。

你的目标是保证用户真实抽签流程稳定：修复或兜底 omamoriAudio.unlock() 可能卡住的问题；确认“今日签文”的产品语义并让代码与文案一致；改善移动端、键盘操作、ARIA 名称、按钮禁用状态、错误兜底、签册筛选和设置弹窗可用性。音频失败、动效关闭、素材加载慢时仍应能完成抽签。

你允许修改 src/components/daily-draw-panel.tsx、src/components/fortune-tube.tsx、src/components/settings-modal.tsx、src/components/collection-list.tsx、src/components/fortune-card.tsx、src/lib/fortune-engine.ts、src/lib/audio.ts、src/store/omamori-store.ts，必要时小范围修改 src/types/omikuji.ts。禁止修改签文 JSON、素材文件和大规模重写 src/constants/fortune.ts 文案。

执行步骤：先搜索 unlock、daily、today、random、aria、disabled；复现抽签流程；优先做最小稳定性修复，例如音频 unlock 超时后继续流程，失败只降级音频不中断抽签；再处理连点、焦点、键盘、移动端和签册空状态；最后运行 lint、tsc、build，并尽量启动本地服务做浏览器手动回归。

验收要求：音频失败不阻断抽签；处理中连点不会产生重复或错乱状态；今日签语义明确且与代码一致；键盘与屏幕阅读器基础可用；移动端主流程无明显遮挡或溢出；lint、tsc、build 通过。完成报告按统一格式输出，并列出浏览器回归路径。
```

### AI-4 提示词：素材、性能与公开发布包

```text
你是 AI-4，负责 H:/Project/御守社 的素材、性能与公开发布包。请全程使用简体中文沟通。先读取 docs/五AI并行优化分工手册.md、docs/后续计划.md、docs/gpt-image-2-素材提示词.md、src/constants/fortune.ts，并扫描 public/images/generated-themes/ 与 public/audio/，再开始工作。

你的目标是建立素材清单，检查哪些素材正在被引用、哪些只是候选、哪些是 legacy；检查缺失引用、重复大图、资源体积和发布包风险；制定压缩、尺寸、格式和懒加载建议。如果确实需要新增素材，必须严格沿用 docs/gpt-image-2-素材提示词.md 的风格要求：明亮、干净、日式二次元游戏资产，无人物、无文字、无水印、无 Logo、非照片，不使用原作游戏素材。

你允许修改 docs/gpt-image-2-素材提示词.md、docs/后续计划.md；必要时只为修正素材引用路径或切换到已确认素材而小范围修改 src/constants/fortune.ts；可在 public/images/generated-themes/ 或 public/audio/ 中新增或替换经审查通过的项目自有素材；如需单独清单，可新增 docs/素材资产审计.md。禁止修改签文 JSON、抽签算法、store、主 UI 组件，不要把 legacy/ 重新接入主配置。

执行步骤：扫描 src/constants/fortune.ts 里的所有 /images/ 引用；对比 public/images/generated-themes/ 实际文件；统计 public/images 与 public/audio 最大文件；为资源标记 active-used、expanded-used、candidate-unused、legacy-reference-only、missing、oversized；先修缺失引用，再处理体积最大且收益明确的问题；如需生图，先写 OOC 判断和提示词，不覆盖旧图。

验收要求：素材引用审计无缺失；发布包体积变化有说明；新增素材与现有风格一致；文档记录素材状态；没有未授权原作素材；没有回接 legacy 或 OOC 旧素材。完成报告按统一格式输出，并说明是否需要 AI-2 更新文案或 AI-3 调整加载体验。
```

### AI-5 提示词：验收、安全、合规与总集成

```text
你是 AI-5，负责 H:/Project/御守社 的验收、安全、合规与总集成。请全程使用简体中文沟通。先读取 docs/五AI并行优化分工手册.md、docs/后续计划.md、docs/gpt-image-2-素材提示词.md、README.md、package.json、src/app/layout.tsx、src/constants/fortune.ts、content/omikuji/fortunes.json，以及 AI-1 到 AI-4 的完成报告，再开始工作。

你的目标是汇总四个 AI 的成果，检查冲突、类型错误、构建错误、文档过期和发布合规；修正 README、后续计划、素材文档或发布清单中的过期信息；确认页面和文档明确标注“东方 Project 二次创作”“非官方”，不得让人误认为官方项目；确认没有原作游戏截图、拆包素材或官方图进入项目；公开版本不设置收费解锁。

你允许修改 README.md、docs/后续计划.md、docs/gpt-image-2-素材提示词.md，可新增 docs/发布验收清单.md；也可以少量修复任何文件中的构建错误、类型错误、路径错误或明显文案冲突，但不要主动重写其他 AI 的核心产出。若必须跨区修复，完成报告中必须说明原因、影响和验证结果。

执行步骤：查看 git diff，按 AI 分区确认改动；运行签文字段审计、路线数量审计、权重审计、素材引用审计；运行 npm run lint、npx tsc --noEmit、npm run build；启动本地服务做浏览器手动回归，覆盖首屏、14 路线展示、至少 3 条路线抽签、音频开关、收藏、签册筛选、设置弹窗、移动端窄屏；最后更新 README 和发布验收清单。

验收要求：lint 通过；tsc 通过；build 通过；签文审计通过；素材引用审计通过；README 与页面元信息不过期；合规说明清晰；已记录残余风险。注意 npm audit 若出现 Next 内置 PostCSS advisory，不要用 npm audit fix --force 强行降级 Next，应记录 advisory、当前版本和等待框架升级或安全补丁的路径。完成报告按统一格式输出。
```

## 十三、建议执行顺序

虽然五个 AI 可以并行，但推荐节奏如下：

1. AI-1 与 AI-4 可以最先启动。AI-1 补内容，AI-4 查素材，互不冲突。
2. AI-2 在 AI-1 开始后即可启动。它不等 AI-1 写完，但要避免改签文 JSON。
3. AI-3 可并行处理流程稳定性，但如果 AI-2 正在扩展类型，需要关注类型变化。
4. AI-5 最后启动，等待 AI-1 到 AI-4 的完成报告。

如果只能分两批：

- 第一批：AI-1、AI-2、AI-4。
- 第二批：AI-3、AI-5。

如果只能一个一个做：

1. AI-1 补签文。
2. AI-2 统一路线文案。
3. AI-3 修交互稳定性。
4. AI-4 查素材和体积。
5. AI-5 总验收。

## 十四、最终交付标准

五个 AI 全部完成后，项目应达到：

- 14 条路线内容密度基本均衡。
- 每条路线有自己的仪式、纸张、道具、声音和阶段文案。
- 抽签流程不因音频或资源失败卡住。
- 今日签文语义清楚。
- 移动端和键盘用户能完成核心流程。
- 素材引用清晰，无缺失、无 legacy 回接、无明显 OOC 回退。
- README 与页面元信息同步 14 路线现状。
- 非官方东方 Project 二次创作声明清晰。
- lint、tsc、build、签文审计、素材审计通过。
