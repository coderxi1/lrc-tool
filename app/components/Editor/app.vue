<script setup lang="ts">
import { AudioInfo } from '~/types'
import AudioPlayer from './AudioPlayer.vue'
import AudioUploader from './AudioUploader.vue'
import LrcAligner from './LrcAligner.vue'
import LrcPreviewer from './LrcPreviewer.vue'
import LrcRawEditor from './LrcRawEditor.vue'
import LrcTimeMarker from './LrcTimeMarker.vue'

const currentTab = ref('文本')
const tabs = [
  { label: '文本', icon: 'mdi:text-box-edit-outline' },
  { label: '打轴', icon: 'lucide:list-plus' },
  { label: '调整', icon: 'mdi:credit-card-edit-outline' },
  { label: '预览', icon: 'pajamas:live-preview' },
]

const editor = useEditorStore()
await editor.init()

const lrc = ref<Lrc>(new Lrc())
watch(()=>editor.lrcRaw, (raw) => lrc.value = Lrc.from(raw),{immediate: true})
const refresh = () => editor.lrcRaw = lrc.value.format({ meta: true })

const audioInfo = ref<AudioInfo>()
const audioTime = ref(0)
watch(()=>editor.audioFile, async (file) => {
  if (audioInfo.value?.playurl) URL.revokeObjectURL(audioInfo.value.playurl)
  audioInfo.value = file ? await AudioInfo.fromFile(file) : undefined
  editor.saveAudioFile()
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col w-full bg-#fff dark:bg-#1F1F1F relative">
    <div class="tab-btns flex h12">
      <button v-for="o in tabs" class="flex h12 gap2 items-center px7 b-b b-r dark:b-#333 bg-#f2f2f2 dark:bg-#181818"
        @click="currentTab = o.label" :class="{ active: currentTab === o.label }">
        <Icon class="w5 h5" :name="o.icon" /><span>{{ o.label }}</span>
      </button>
      <div class="flex-1 b-b dark:b-#333 bg-#f2f2f2 dark:bg-#181818"></div>
    </div>
    <div class="p4 flex-1 flex flex-col mb22">
      <div class="tab-content" v-show="currentTab === '文本'"><LrcRawEditor v-model="editor.lrcRaw" /></div>
      <div class="tab-content" v-show="currentTab === '打轴'"><LrcTimeMarker :lines="lrc.lines" :time="audioTime" :refresh="refresh" /></div>
      <div class="tab-content" v-show="currentTab === '调整'"><LrcAligner :lines="lrc.lines" :time="audioTime" :audio="audioInfo" /></div>
      <div class="tab-content" v-show="currentTab === '预览'"><LrcPreviewer :lines="lrc.lines" :time="audioTime" /></div>
    </div>
    <div class="absolute wfull bottom-0 h22 bg-#fff dark:bg-#1F1F1F">
      <AudioPlayer class="full" v-if="audioInfo" :audio="audioInfo" @timeupdate="t => audioTime = t">
        <template #end>
          <button @click="editor.audioFile = undefined; audioTime = 0" class="b px2 py1 text-xs rounded-lg">重新选择</button>
        </template>
      </AudioPlayer>
      <div v-else class="p3 full">
        <AudioUploader class="full" @change="f => editor.audioFile = f" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tab-btns {
  button.active {
    border-bottom: 0;
    background: transparent;
  }
}

.tab-content {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
}
</style>