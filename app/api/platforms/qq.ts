import { Platform } from '.'

class QQMusic extends Platform {
  name = 'qq'
  label = 'QQ音乐'
  icon = 'custom:qq-music'
  domains = ['music.qq.com', 'y.qq.com']
  override async enhancedSearch(input: string): Promise<SearchResult> {
    if (isUrl(input)) {
      let url = new URL(input)
      const path = url.pathname
      const host = url.host
      //处理短链接
      if (host === 'c6.y.qq.com' && path === '/base/fcgi-bin/u') {
        url = new URL(await getRedirectUrl(url))
      }
      //根据path匹配type&id
      const lastsubpath = path.split('/').at(-1)!
      const params = Object.fromEntries(url.searchParams.entries())
      if (path.includes('/songDetail/') && lastsubpath) {
        return { songs: [await this.getSongById(lastsubpath)] }
      }
      if (path.includes('/albumDetail/') && lastsubpath) {
        const album = await this.getAlbumById(lastsubpath)
        return { albums: [album], songs: album.songs }
      }
      if (path.includes('/playlist/') && lastsubpath) {
        const playlist = await this.getPlaylistById(lastsubpath)
        return { playlists: [playlist], songs: playlist.songs }
      }
      if (path.endsWith('/playsong.html') && (params.songid || params.songmid)) {
        return { songs: [await this.getSongById(params.songid || params.songmid!)] }
      }
      if (path.endsWith('/album.html') && (params.albumid || params.albummid)) {
        const album = await this.getAlbumById(params.albumid || params.albummid!)
        return { albums: [album], songs: album.songs }
      }
      if (path.endsWith('/taoge.html') && params.id) {
        const playlist = await this.getPlaylistById(params.id)
        return { playlists: [playlist], songs: playlist.songs }
      }
    }
    return this.search(input)
  }
}
export default new QQMusic()
