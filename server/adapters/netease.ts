import { getNeteaseEncrypt } from "../utils/netease-crypto"

const dataSongConvert = (song:any) : Song => ({
  plaform: 'netease',
  plaformId: song.id,
  name: song.name,
  alias: song.transName,
  title: song.name,
  album: song.album?.name,
  cover: song.album?.picUrl,
  artists: (song.artists as { name:string}[])?.map((s) => s.name),
  lyrics: undefined,
})

const getSongsByIds = async (ids: string[]): Promise<Song[]> => {
  const data = await fetch(`https://music.163.com/api/song/detail?ids=[${ids.join(',')}]`).then((r) => r.json())
  return data.songs.map(dataSongConvert)
}

export const getSongById = async(id:string) :Promise<Song> => (await getSongsByIds([id]))[0]

export const getLyricsBySongId = async (songId: string): Promise<Lyrics> => {
  const data = await fetch(`https:///music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&rv=-1&id=${songId}`).then((r) => r.json())
  const data_lrc = (key:string) => new LrcItem(data[key]?.lyric || '').formatLRC()
  return {
    original: data_lrc('lrc'),
    translation: data_lrc('tlyric'),
    romanization: data_lrc('romalrc')
  }
}

export const getAlbumById = async (albumId: string, pageNumber:number = 1, pageSize: number = Infinity): Promise<WithSongs<Album>> => { 
  const data = await fetch(`https://music.163.com/api/v1/album/${albumId}`).then((r) => r.json())
  const songIds = (data.songs as any[]).map((s)=>String(s.id))
  const pagedIds = (!songIds || songIds.length === 0) ? [] : (songIds.length <= pageSize ? songIds : songIds.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize));
  return {
    name: data.album?.name,
    alias: data.album?.alias.join('/'),
    artists: ((data.album?.artists||[]) as any[]).map(a=>String(a.name)) || undefined,
    cover: data.album?.picUrl,
    description: data.album?.description,
    songs: await getSongsByIds(pagedIds),
    songsTotal: songIds.length
  }
}

export const getPlaylistById = async (playlistId: string, pageNumber:number = 1, pageSize: number = Infinity): Promise<WithSongs<Playlist>> => {
  const data = await fetch(`https://music.163.com/api/v6/playlist/detail?s=0&id=${playlistId}`).then((r) => r.json())
  const songIds = (data.playlist?.trackIds as any[]).map((t)=>String(t.id))
  const pagedIds = (!songIds || songIds.length === 0) ? [] : (songIds.length <= pageSize ? songIds : songIds.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize));
  return {
    name: data.playlist?.name,
    creator: data.playlist?.creator.nickname,
    cover: data.playlist?.coverImgUrl,
    description: data.playlist?.description,
    songs: await getSongsByIds(pagedIds),
    songsTotal: songIds.length
  }
}

export const searchSongsByKeyword = async (keyword: string, cookie: string, pageNumber:number = 1, pageSize: number = 50) : Promise<WithSongs<{}>> => {
  const encrypted = getNeteaseEncrypt(JSON.stringify({
    limit: String(pageSize),
    offset: String(pageNumber),
    s: keyword,
    total: "true",
    type: "1",
  }));
  const resp = await fetch('https://music.163.com/weapi/cloudsearch/get/web',{
    method: 'POST',
    body: new URLSearchParams({
      params: String(encrypted.encText),
      encSecKey: String(encrypted.encSecKey)
    }),
    headers: {cookie}
  }).then(r=>r.json())
  return {
    songs: resp.result.songs.map((song:any) => Object.assign(dataSongConvert(song),{
      alias: song.tns?.join('/'),
      album: song.al.name,
      cover: song.al.picUrl,
      artists:  (song.ar as { name:string}[])?.map((s) => s.name),
    })),
    songsTotal: resp.result.songCount
  }
}

export const search = async (query: SearchRequestQuery): Promise<SearchResult> => {
  switch (query.type) {
    case 'song': {
      return { songs: [await getSongById(query.id)] }
    }
    case 'album': {
      const album = await getAlbumById(query.id,query.pn,query.ps)
      const songs = album.songs
      delete album.songs
      return { albums: [album], songs }
    }
    case 'playlist': {
      const playlist = await getPlaylistById(query.id,query.pn,query.ps)
      const songs = playlist.songs
      delete playlist.songs
      return { playlists: [playlist], songs }
    }
    case 'keyword':
    default: {
      return query.NETEASE_MUSIC_U ? await searchSongsByKeyword(query.keyword, query.NETEASE_MUSIC_U,query.pn,query.ps) : {}
    }
  }
}