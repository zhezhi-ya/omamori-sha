# Touhou Music

该目录用于放置个人本地使用的东方相关背景音乐文件。页面会读取 `tracks.json`，再按照 `playbackMode` 指定的模式播放曲目。

当前约定：

- 音乐文件使用数字编号命名，例如 `001.mp3`、`002.mp3`。
- `tracks.json` 中的 `playbackMode` 设为 `random`，表示每次进入时随机选一首。
- `tracks.json` 的 `source` 字段保留重命名前的原始文件名，方便之后追溯曲目信息。
- 如果追加或删除音乐文件，需要同步更新 `tracks.json`。

示例：

```json
{
  "playbackMode": "random",
  "tracks": [
    {
      "title": "001",
      "circle": "Touhou Music",
      "src": "/audio/music/001.mp3",
      "source": "original-file-name.mp3"
    }
  ]
}
```

可用播放模式：

- `random`：随机选择曲目播放。
- `sequential`：按 `tracks` 中的顺序尝试播放。

如果 `tracks.json` 为空或音频无法播放，页面会自动切换为 Web Audio API 合成的东方风短循环。
