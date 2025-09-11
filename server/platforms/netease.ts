import { Platform } from '.'
import { encrypt } from '../utils/netease-crypto'

const API = {
  songs: async (ids: string[]) => fetchJson(`https://music.163.com/api/song/detail?ids=[${ids.join(',')}]`),
  lyrics: async (songId: string) => fetchJson(`https:///music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&rv=-1&id=${songId}`),
  album: async (albumId: string) => fetchJson(`https://music.163.com/api/v1/album/${albumId}`),
  playlist: async (playlistId: string) => fetchJson(`https://music.163.com/api/v6/playlist/detail?s=0&id=${playlistId}`),
  cloudsearch: async (s: string, headers: any) => fetchJson('https://music.163.com/weapi/cloudsearch/get/web', { method: 'POST', body: encrypt({ s, total: 'true', type: '1' }).toURLSearchParams(), headers }),
}

const convertSong = (song: any): Song => ({
  platform: 'netease',
  platformId: song.id,
  name: song.name,
  alias: song.transName,
  title: song.name,
  album: song.album?.name,
  cover: song.album?.picUrl,
  artists: (song.artists as { name: string }[])?.map((s) => s.name),
})

const getSongsByIds = async (ids: string[]): Promise<Song[]> => (await Promise.all(Array.from({ length: Math.ceil(ids.length / 200) }, (_, i) => API.songs(ids.slice(i * 200, (i + 1) * 200)).then((data) => data.songs.map(convertSong))))).flat()

const netease: Platform = {
  search: async function (keyword: string, headers?: Record<string, string>): Promise<SearchResult> {
    if (!headers || !headers['MUSIC_U']) {
      throw new Error("此请求需要MUSIC_U参数!")
    }
    const data = await API.cloudsearch(keyword, headers)
    return {
      songs: data.result.songs.map((song: any) => ({
        ...convertSong(song),
        alias: song.tns?.join('/'),
        album: song.al.name,
        cover: song.al.picUrl,
        artists: song.ar?.map((s:any) => s.name),
      })),
    }
  },
  getSongById: async function (id: string): Promise<Song> {
    return (await getSongsByIds([id]))[0]
  },
  getAlbumById: async function (id: string): Promise<WithSongs<Album>> {
    const data = await API.album(id)
    const songIds = data.songs?.map((s: any) => s.id)
    return {
      name: data.album?.name,
      alias: data.album?.alias.join('/'),
      artists: data.album?.artists.map((a: any) => a.name),
      cover: data.album?.picUrl,
      description: data.album?.description,
      songs: await getSongsByIds(songIds),
      songsTotal: songIds.length,
    }
  },
  getPlaylistById: async function (id: string): Promise<WithSongs<Playlist>> {
    const data = await API.playlist(id)
    const songIds = data.playlist?.trackIds.map((t: any) => t.id)
    return {
      name: data.playlist?.name,
      creator: data.playlist?.creator.nickname,
      cover: data.playlist?.coverImgUrl,
      description: data.playlist?.description,
      songs: await getSongsByIds(songIds),
      songsTotal: songIds.length,
    }
  },
  getLyricsBySongId: async function (id: string): Promise<Lyrics> {
    const data = await API.lyrics(id)
    const dataLrc = (key: string) => Lrc.from(data[key]?.lyric).format()
    return {
      original: dataLrc('lrc'),
      translation: dataLrc('tlyric'),
      romanization: dataLrc('romalrc'),
    }
  },
}
export default netease
