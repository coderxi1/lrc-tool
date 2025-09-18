import subsrt from 'subsrt-ts'

export type LrcMeta = Record<string, string>
export type LrcLine = { time: number; text: string; raw: string }
export type LrcLineHandler = (line: string, ctx: Lrc) => boolean|void|undefined
export type LrcFormatConfig = { to?: string; meta: boolean }

export class Lrc {
  meta: LrcMeta = {}
  lines: LrcLine[] = []
  static from(raw?: string) {
    return raw ? new LrcBuilder(raw).build() : new Lrc()
  }
  static readonly FORMAT_TYPES = [...new Set(['lrc','srt','txt',...subsrt.list().sort()])]
  static formatTime = (time:number) => {
    if(time === -1) return ''
    const minutes = Math.floor(time / 60).toString().padStart(2, '0')
    const seconds = (time % 60).toFixed(2).padStart(5, '0')
    return `${minutes}:${seconds}`
  }
  format(config?: LrcFormatConfig): string {
    const { to = 'lrc', meta = false } = config||{}
    if (to === 'txt') {
      return this.lines.map(({ text }) => text).join('\n')
    }
    const lrc = [
      ...(meta ? Object.entries(this.meta).map(([k, v]) => `[${k}:${v}]`).concat('') : []).filter(Boolean),
      ...this.lines.map(({ time, text }) => {
        if (time == -1) return text
        return `[${Lrc.formatTime(time)}]${text}`
      }),
    ].join('\n')

    if (to === 'lrc') return lrc
    else return subsrt.convert(lrc, { from: 'lrc', to: to })
  }
  concat(that: Lrc | string, that_weight?: number) {
    if (typeof that === 'string') that = new LrcBuilder(that).build()
    type LrcLinesWithWeight = (LrcLine & { weight: number })[]
    const thisLines = (this.lines as LrcLinesWithWeight).map((line) => ({ ...line, weight: line.weight || 0 }))
    const thatLines = (that.lines as LrcLinesWithWeight).map((line) => ({ ...line, weight: that_weight || 0 }))
    thisLines.push(...thatLines)
    thisLines.sort((a, b) => {
      if (a.time !== b.time) {
        return a.time - b.time
      }
      return a.weight - b.weight
    })
    this.lines = thisLines
  }
}

export class LrcBuilder {
  private raw: string
  constructor(raw: string) {
    this.raw = raw
  }
  lineHandlers: LrcLineHandler[] = [
    (line, lrc) => {
      const m = line.match(/^\[(\w+):(.*)\]$/)
      if (!m) return
      lrc.meta[m[1]!] = m[2]!.trim()
      return true
    },
    (line, lrc) => {
      const m = line.match(/\[(\d{2}):(\d{2}(?:[.:]\d{1,5})?)\](.*)/)
      if (!m) return
      const minutes = parseInt(m[1]!, 10)
      const seconds = parseFloat(m[2]!)
      const text = m[3]?.trim() || ''
      lrc.lines.push({ time: minutes * 60 + seconds, text, raw: line })
      return true
    }
  ]
  handler(handler: LrcLineHandler) {
    this.lineHandlers.push(handler)
    return this
  }
  build() {
    const lrc = new Lrc()
    const lines = this.raw.split(/\r?\n/)
    lines.forEach((line) => {
      let handled = false
      for (const handler of this.lineHandlers) {
        if (handler(line, lrc)) {
          handled = true
          break
        }
      }
      if (!handled) {
        lrc.lines.push({ time: -1, text: line, raw: line })
      }
    })
    return lrc
  }
}
