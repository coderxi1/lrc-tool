export class LyricFile {
  id: string
  name: string
  lrc: string

  constructor(id: string, name: string, lrc: string) {
    this.id = id
    this.name = name
    this.lrc = lrc
  }
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    lyricFiles: [
      {name:'忘れじの言の葉'},
      {name:'我将在何处游荡'},
    ] as LyricFile[],
  }),
  actions: {
    newLyricFile(id:string, name: string, lrc: string) {
      this.lyricFiles.push(new LyricFile(id,name,lrc))
    },
    removeLyricFile(id: string) {
      this.lyricFiles = this.lyricFiles.filter((f) => f.id !== id)
    }
  },
})
