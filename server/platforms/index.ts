import netease from '~~/server/platforms/netease'
import qq from '~~/server/platforms/qq'

export const platforms = { netease, qq }
export const usePlatform = (name?: string) => {
   if (!name || !Object.keys(platforms).includes(name))
    throw new Error(`不支持的音乐平台: [${name}] !`)
  return platforms[name as keyof typeof platforms]
}

export interface Platform {
  search(keyword: string, headers?: Record<string,string>): Promise<SearchResult>
  getSongById(id: string): Promise<Song>
  getAlbumById(id: string): Promise<WithSongs<Album>>
  getPlaylistById(id: string): Promise<WithSongs<Playlist>>
  getLyricsBySongId(id: string): Promise<Lyrics>
}