import { parseBlob } from 'music-metadata-browser'
export class AudioInfo {
  playurl: string
  title?: string
  artist?: string
  cover?: string
  constructor(playurl: string) {
    this.playurl = playurl
  }
  static fromFile = async (file: File): Promise<AudioInfo> => {
    const info = new AudioInfo(URL.createObjectURL(file))
    info.title = file.name
    try {
      const { common } = await parseBlob(file)
      info.title = common.title || file.name
      info.artist = common.artist || ''
      if (common.picture?.length) {
        const { data, format } = common.picture[0]!
        info.cover = URL.createObjectURL(new Blob([new Uint8Array(data)], { type: format }))
      }
    } catch {}
    return info
  }
}