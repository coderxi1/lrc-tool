export const useEditorStore = defineStore('editor', {
  state: () => ({
    lrcRaw: ref<string>(),
    audioFile: ref<File | null>(),
  }),
  actions: {
    async init() {
      this.audioFile = await fileStorage.loadFile('editor-audioFile')
    },
    async saveAudioFile() {
      if (this.audioFile) {
        await fileStorage.saveFile(this.audioFile, 'editor-audioFile')
      }
    },
  },
})
