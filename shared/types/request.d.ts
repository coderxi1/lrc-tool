export interface SearchResult {
  albums?: Album[]
  songs?: Song[]
  playlists?: Playlist[]
}

export type WithSongs<T = any> = T & {
  songs?: Song[]
  songsTotal?: number
}