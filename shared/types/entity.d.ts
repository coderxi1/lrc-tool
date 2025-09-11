type Album = {
  name: string
  alias: string
  artists: string[]
  cover: string
  description: string
}

type Playlist = {
  name: string
  creator: string
  cover: string
  description: string
}

type Song = {
  platform: PlatformEnum// 源平台
  platformId: string    // 源平台ID
  name?: string         // 歌名
  alias?: string        // 别名
  title?: string        // 完全版歌名
  album?: string        // 专辑
  cover?: string        // 封面
  artists?: string[]    // 艺术家
  lyrics?: Lyrics       // 歌词
}

type Lyrics = {
  original: string      // 原文歌词
  translation: string   // 翻译歌词
  romanization: string  // 罗马拼音
}