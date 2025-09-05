const data2song = (song: any): Song => ({
  plaform: 'netease',
  plaformId: song.id,
  name: song.name,
  alias: song.transName,
  title: song.name,
  album: song.album?.name,
  cover: song.album?.picUrl,
  artists: (song.artists as { name: string }[])?.map((s) => s.name),
  lyrics: undefined,
})

export const getSongsByIds = async (ids: string[]): Promise<Song[]> => {
  const data = await fetch(`https://music.163.com/api/song/detail?ids=[${ids.join(',')}]`).then((r) => r.json())
  return data.songs.map(data2song)
}

export const getSongById = async(id:string) :Promise<Song> => (await getSongsByIds([id]))[0]

export const getAlbumById = async (albumId: string, pageNumber:number = 1, pageSize: number = 10): Promise<WithSongs<Album>> => { 
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
    songsTotal: data.songs.length
  }
}

export const getPlaylistById =  async (playlistId: string, pageNumber:number = 1, pageSize: number = 10): Promise<WithSongs<Playlist>> => {
  const data = await fetch(`https://music.163.com/api/v6/playlist/detail?s=0&id=${playlistId}`).then((r) => r.json())
  const songIds = (data.playlist?.trackIds as any[]).map((t)=>String(t.id))
  const pagedIds = (!songIds || songIds.length === 0) ? [] : (songIds.length <= pageSize ? songIds : songIds.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize));
  return {
    name: data.playlist?.name,
    creator: data.playlist?.creator.nickname,
    cover: data.playlist?.coverImgUrl,
    description: data.playlist?.description,
    songs: await getSongsByIds(pagedIds),
    songsTotal: songIds.length,
  }
}

export const getLyricsBySongId = async (id: string): Promise<Lyrics> => {
  const data = await fetch(`https:///music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&rv=-1&id=${id}`).then((r) => r.json())
  return {
    original: data.lrc?.lyric.trim() || '',
    translation: data.tlyric?.lyric.trim() || '',
    romanization: data.romalrc?.lyric.trim() || '',
  }
}