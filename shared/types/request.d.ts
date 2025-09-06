export interface SearchRequestQuery {
  platform: 'netease' | 'qq'
  type: 'keyword' | 'song' | 'album' | 'playlist'
  id: string,
  keyword: string,

  pn?: number,
  ps?: number,

  NETEASE_MUSIC_U: string
}

export interface SearchResult {
  albums?: Album[]
  songs?: Song[]
  playlists?: Playlist[]
}