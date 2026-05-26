# Character Images

该目录用于放置东方角色图素材，供本地个人项目展示使用。

当前目录：

- `moegirl/`：从萌娘百科角色页主图下载的本地角色图，当前覆盖 122 名东方角色。
- `lostword/`：早期手动加入的 Touhou LostWord 官方网站角色图，作为历史素材保留。
- `lostword-icons/`：预留给 Touhou LostWord Wiki 图标兜底素材。

签文数据中的 `characterImage` 字段会优先指向这里的本地文件；`src/constants/design-tokens.ts` 的 `characterThemeMap` 也会为角色提供默认 `portrait`。

补充新角色图时：

- 将图片放入该目录或子目录。
- 在 `content/omikuji/fortunes.json` 的对应签文加入 `characterImage`。
- 如希望同角色签文共享默认图，也在 `src/constants/design-tokens.ts` 的 `characterThemeMap` 中加入或更新 `portrait`。
- 若图片缺失，页面会显示风格化角色肖像，不会出现破图。

素材说明：

- 萌娘百科内容要求转载请标注来源页面链接，并声明引自萌娘百科；本项目按用户需求用于本地个人展示。
- 若要发布或传播项目，请重新确认所有图片授权与署名要求。
