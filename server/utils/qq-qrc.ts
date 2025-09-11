import { decodeQrc } from './qq-des'
import { XMLParser } from 'fast-xml-parser'

export class Qrc extends Lrc {
  static fromHex(hex?: string, isXml: boolean = true) {
    if (!hex||hex.length<=64) return new Qrc()
    const raw = decodeQrc(hex)
    if (!raw) return new Qrc()
    if (!isXml) return new QrcBuilder(raw).build()
    const data = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' }).parse(raw)
    const lrc = data.QrcInfos?.LyricInfo?.Lyric_1?.LyricContent
    return new QrcBuilder(lrc).build()
  }
}

export class QrcBuilder extends LrcBuilder {
  constructor(raw: string) {
    super(raw)
    this.handler((line, lrc) => {
      const m = line.match(/^\[(\d+),\d+\](.*)$/)
      if (!m) return
      const time = parseInt(m[1], 10) / 1000
      const line_content = m[2]
      const regex_word = /\(\d+,\d+\)(.*?)(?=\(\d+,\d+\)|$)/g
      let text = (line_content.match(/^[^\(]+/) || [''])[0]
      let match_word
      while ((match_word = regex_word.exec(line_content)) !== null) {
        const word = match_word[1]
        if (word) text += word
      }
      lrc.lines.push({ time, text, raw: line })
      return true
    })
  }
}
