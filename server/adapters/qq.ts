import { decodeQRC } from '../utils/qq-des'
import { XMLParser } from 'fast-xml-parser'
const parseXml = (xml:string) => new XMLParser().parse(xml)
const parseXmlWithAttr = (xml:string) => new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' }).parse(xml)
class QrcItem extends LrcItem {
  handleNoMatchLine(line: string) {
    const match = line.match(/^\[(\d+),\d+\](.*)$/);
    if (!match) return;
    const time = parseInt(match[1], 10) / 1000;
    const line_content = match[2];
    const regex_word = /\(\d+,\d+\)(.*?)(?=\(\d+,\d+\)|$)/g;
    let text = (line_content.match(/^[^\(]+/)||[''])[0]
    let match_word;
    while ((match_word = regex_word.exec(line_content)) !== null) {
      const word = match_word[1].trim();
      if (word) text += word
    }
    this.content.push({ time, text });
  }
}

const getImageUrlByMid = (mid:string) => `https://y.qq.com/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`

const qqRequestInit = (params: any): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ ...params, format: 'json', platform: 'yqq' }),
})

const dataSongConvert = (song:any) : Song => ({
  plaform: 'qq',
  plaformId: song.id,
  name: song.name,
  alias: song.subtitle || song.name!=song.title ? song.title.slice(song.name.length).trim() : '',
  title: song.name,
  album: song.album?.name,
  cover: getImageUrlByMid(song.album.mid),
  artists: (song.singer as {name:string}[])?.map(s=>s.name),
  lyrics: undefined,
})

export const getSongByIdOrMid = async (idOrMid: string): Promise<Song> => {
  const data = await fetch(`https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg`, qqRequestInit({
    songid: isNumeric(idOrMid) ? idOrMid : '',
    songmid: isNumeric(idOrMid) ? '' : idOrMid,
  })).then((r) => r.json())
  return dataSongConvert(data.data[0])
}

export const getLyricsBySongId = async (songId: string): Promise<Lyrics> => {
  const data = await fetch(`https://c.y.qq.com/qqmusic/fcgi-bin/lyric_download.fcg`, qqRequestInit({
    version: '15',
    miniversion: '82',
    lrctype: '4',
    musicid: songId,
  })).then((r) => r.text()).then(xml=>parseXml(xml.replace('<!--', '').replace('-->', '').replace(/<miniversion.*\/>/, '')))
  
  const lyricHexs = (Object.values(data) as any)[0]['cmd']['lyric']
  return {
    original: await decodeQRC(lyricHexs.content)
                      .then(parseXmlWithAttr)
                      .then((data:any)=>data.QrcInfos?.LyricInfo?.Lyric_1?.LyricContent)
                      .then(qrc=>new QrcItem(qrc).formatLRC()),
    translation: await decodeQRC(lyricHexs.contentts)
                      .then(lrc=>new LrcItem(lrc).formatLRC()),
    romanization: await decodeQRC(lyricHexs.contentroma)
                      .then(parseXmlWithAttr)
                      .then((data:any)=>data.QrcInfos?.LyricInfo?.Lyric_1?.LyricContent)
                      .then(qrc=>new QrcItem(qrc).formatLRC()),
  }
}

export const getAlbumByIdOrMid = async (idOrMid: string): Promise<WithSongs<Album>> => {
  const data = await fetch(`https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_detail_cp.fcg`, qqRequestInit({
    albumid: isNumeric(idOrMid) ? idOrMid : '',
    albummid: isNumeric(idOrMid) ? '' : idOrMid,
    newsong: 1
  })).then((r) => r.json()).then(d=>d.data)
  return {
    name: data.getAlbumInfo.Falbum_name,
    alias: data.getAlbumInfo.Fother_name,
    artists: data.getAlbumInfo.Fsinger_all,
    cover: getImageUrlByMid(data.getAlbumInfo.Falbum_mid),
    description: data.getAlbumDesc.Falbum_desc,
    songs: data.getSongInfo.map(dataSongConvert),
  }
}

export const getPlaylistById =  async (playlistId: string): Promise<WithSongs<Playlist>> => {
  const data = await fetch(`https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg`, qqRequestInit({
    id: playlistId,
    newsong: 1
  })).then((r) => r.json()).then(d=>d.data)
  const l = data.cdlist[0]
  return {
    name: l.dissname,
    creator: l.nickname,
    cover: l.logo,
    description: l.des,
    songs: l.songlist.map(dataSongConvert),
    songsTotal: l.total_song_num,
  }
}

export const searchSongsByKeyword = async (keyword: string, pageNumber:number = 1, pageSize: number = 50) : Promise<WithSongs<{}>> => {
  const data = await fetch(`https://u.y.qq.com/cgi-bin/musicu.fcg`, {
    method:'POST',
    body: JSON.stringify({
      req_1: {
        method: "DoSearchForQQMusicDesktop",
        module: "music.search.SearchCgiService",
        param: {
          num_per_page: pageSize,
          page_num: pageNumber,
          query: keyword,
          search_type: "1"
        }
      }
    })
  }).then((r) => r.json()).then(d=>d.req_1.data)
  const songs = data.body.song.list
  return {
    songs: songs.map(dataSongConvert),
    songsTotal: data.meta.sum
  }
}

export const search = async (query: SearchRequestQuery): Promise<SearchResult> => {
  switch (query.type) {
      case 'song': {
        return { songs: [await getSongByIdOrMid(query.id)] }
      }
      case 'album': {
        const album = await getAlbumByIdOrMid(query.id)
        const songs = album.songs
        delete album.songs
        return { albums: [album], songs }
      }
      case 'playlist': {
        const playlist = await getPlaylistById(query.id)
        const songs = playlist.songs
        delete playlist.songs
        return { playlists: [playlist], songs }
      }
      case 'keyword':
      default: {
        return await searchSongsByKeyword(query.keyword,query.pn,query.ps)
      }
    }
}