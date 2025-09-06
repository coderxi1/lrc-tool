export class LrcItem {
  text: string
  meta: Record<string, string> = {}
  content: { time: number; text: string }[] = []
  constructor(lrc: string) {
    this.text = lrc.trim()
    const lines = lrc.split(/\r?\n/)
    for (const line of lines) {
      const match = line.match(/^\[(\w+):(.*)\]$/)
      if (match) {
        this.meta[match[1]!] = match[2]!.trim()
        continue
      }
      const match_lyric = line.match(/\[(\d{2}):(\d{2}(?:\.\d{2,3})?)\](.*)/)
      new Date().getMilliseconds
      if (match_lyric) {
        const minutes = parseInt(match_lyric[1]!, 10)
        const seconds = parseFloat(match_lyric[2]!)
        const text = this.handleContentText(match_lyric[3]||'')
        this.content.push({time: minutes * 60 + seconds, text})
        continue
      }
      this.handleNoMatchLine(line)
    }
  }
  handleContentText(text: string) {
    return text.trim()
  }
  handleNoMatchLine(line: string) {
    if (line) {
      this.content.push({
        time: -1,
        text: line,
      })
    }
  }
  formatLRC(config = {meta:false}): string {
    const content = this.content.map((item) => {
      const minutesNum = Math.floor(item.time / 60)
      const minutes = minutesNum < 100 ? minutesNum.toString().padStart(2, '0') : minutesNum.toString()
      const seconds = (item.time % 60).toFixed(2).padStart(5, '0')
      return `[${minutes}:${seconds}]${item.text}`
    }).join('\n')
    const meta = !config.meta ? '' : Object.entries(this.meta).map(([k,v])=>`[${k}:${v}]`)
    return meta + content
  }
}
