import type { Platform as ServerPlatform } from '~~/server/platforms'

export abstract class Platform implements ServerPlatform {
  abstract name: string
  abstract label: string
  abstract icon: string
  abstract domains: string[]
  abstract enhancedSearch(input: string): Promise<SearchResult> ;
  search(keyword: string, headers?: Record<string, string>): Promise<SearchResult> {
    return fetchJson<SearchResult>(`/api/platform/${this.name}/search?${new URLSearchParams({keyword})}`)
  }
  getSongById(id: string): Promise<Song> {
    return fetchJson<Song>(`/api/platform/${this.name}/song/${id}`)
  }
  getAlbumById(id: string): Promise<WithSongs<Album>> {
    return fetchJson<WithSongs<Album>>(`/api/platform/${this.name}/album/${id}`)
  }
  getPlaylistById(id: string): Promise<WithSongs<Playlist>> {
    return fetchJson<WithSongs<Playlist>>(`/api/platform/${this.name}/playlist/${id}`)
  }
  getLyricsBySongId(id: string): Promise<Lyrics> {
    return fetchJson<WithSongs<Lyrics>>(`/api/platform/${this.name}/lyrics/${id}`)
  }
  
}