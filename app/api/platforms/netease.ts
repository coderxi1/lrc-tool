import { Platform } from '.'

class Netease extends Platform {
  name = 'netease'
  label = '网易云音乐'
  icon = 'custom:netease-music'
  domains = ['music.163.com', '163cn.tv']
  override async enhancedSearch(input: string): Promise<SearchResult> {
    if (isUrl(input)) {
      let url = new URL(input)
      
      //处理短链接
      if (url.hostname === '163cn.tv') {
        url = new URL(await getRedirectUrl(url))
      }
      //处理vue hash url
      if (url.pathname === '/' && url.hash.startsWith('#/')) {
        url = new URL(url.hash.slice(1), url)
      }
      //根据path匹配type&id
      const path = url.pathname
      const params = Object.fromEntries(url.searchParams.entries())
      if (path.endsWith('/song') && params.id) {
        return { songs: [await this.getSongById(params.id)] }
      }
      if (path.endsWith('/album') && params.id) {
        const album = await this.getAlbumById(params.id)
        return { albums: [album], songs: album.songs }
      }
      if (path.endsWith('/playlist') && params.id) {
        const playlist = await this.getPlaylistById(params.id)
        return { playlists: [playlist], songs: playlist.songs }
      }
    }
    return this.search(input)
  }
}
export default new Netease()
