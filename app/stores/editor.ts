export class LyricFile {
  name: string
  lrc: string

  constructor(name: string, lrc: string) {
    this.name = name
    this.lrc = lrc
  }
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    lyricFiles: [] as LyricFile[],
  }),
  actions: {
    findLyricFile(name: string) {
      return this.lyricFiles.find((f) => f.name === name)
    },
    newUntitledLyricFile() {
      const lastIndex = parseInt(this.lyricFiles.findLast(f=>f.name.startsWith("Untitled-"))?.name.split('-')[1] || '0')
      const file = new LyricFile(`Untitled-${lastIndex + 1}`,"")
      this.lyricFiles.push(file)
      return file
    },
    newLyricFile(name: string, lrc: string) {
      const file = new LyricFile(name,lrc)
      this.lyricFiles.push(file)
    },
    removeLyricFile(name: string) {
      this.lyricFiles = this.lyricFiles.filter((f) => f.name !== name)
    }
  },
})
