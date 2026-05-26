# Ambience Audio / Music

该目录预留给低频氛围音资源。当前背景音乐入口已经迁移到：

- `public/audio/music`

如果 `public/audio/music` 中没有对应曲目文件，运行时会自动退回到 `Web Audio API` 合成的东方风旋律循环，不再使用白噪音作为主要背景。

后续如果需要补充氛围铺底素材，建议：

- 统一使用 `ogg` 或 `mp3`
- 控制单文件体积，避免移动端首屏负担
- 保持循环段自然、无明显爆点
- 文件命名示例：`night-shrine-loop.ogg`
