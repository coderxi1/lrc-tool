<script setup lang="ts">
import { useEditorStore, LyricFile } from '@/stores/editor'

const editorStore = useEditorStore()
const currentLyricFile = ref<LyricFile>()
const tabs = reactive({
  options: [
    { label: '文本', icon: 'mdi:text-box-edit-outline' },
    { label: '打轴', icon: 'mdi:playlist-plus' },
    { label: '调整', icon: 'mdi:credit-card-edit-outline' }
  ],
  activeLabel: '文本'
})
const createFile = () => {
  currentLyricFile.value = editorStore.newUntitledLyricFile()
}

onMounted(()=>{
  const currentLyricFileName = useRoute().query.file as string
  if (currentLyricFileName) {
    currentLyricFile.value = editorStore.findLyricFile(currentLyricFileName)
  }
  useRouter().replace({ query: {} }) 
})

const lrcValue = ref('')
watch(currentLyricFile,(file) => {
  lrcValue.value = file?.lrc || ''
})
</script>

<template>
  <div
    class="wfull max-w-1400px m-auto flex flex-1 rounded-lg b dark:b-#333 bg-white dark:bg-#181818 overflow-hidden shadow-md">
    <!-- 歌词列表 -->
    <div class="min-w-16em flex flex-col b-r bg-#f5f5f5 dark:b-#333 dark:bg-#181818">
      <div class="font-bold h12 px-4 lh-12 b-b-1 dark:b-#222">歌词列表</div>
      <div class="lyric-files flex flex-col py2">
        <button class="w-full text-left cursor-pointer pl-4 py1.5 hover:bg-black/4 dark:hover:bg-white/4"
          v-for="(file,index) in editorStore.lyricFiles" :key="index" @click="currentLyricFile = file"
          :class="{ active: currentLyricFile === file }">{{ file.name }}</button>
      </div>
    </div>

    <!-- 编辑区 -->
    <div class="flex-1 flex flex-col dark:bg-#1F1F1F">
      <div v-if="currentLyricFile" class="flex-1 flex flex-col">
        <div class="tab-btns flex h12 bg-#f5f5f5 dark:bg-#181818">
          <button v-for="o in tabs.options" class="flex h12 gap2 items-center px7 b-b b-r dark:b-#333"
            @click="tabs.activeLabel = o.label" :class="{ active: tabs.activeLabel === o.label }">
            <Icon class="w6 h6" :name="o.icon" /><span>{{ o.label }}</span>
          </button>
          <div class="flex-1 b-b dark:b-#333"></div>
        </div>
        <div class="p4 flex-1 flex flex-col">
          <div class="flex-1 flex flex-col" v-show="tabs.activeLabel === '文本'"><MyTextarea class="flex-1" v-model="lrcValue"></MyTextarea></div>
          <div class="flex-1 flex flex-col" v-show="tabs.activeLabel === '打轴'">打轴编辑器</div>
          <div class="flex-1 flex flex-col" v-show="tabs.activeLabel === '调整'">调整编辑器</div>
        </div>
      </div>
      <div v-else class="flex-1 p20">
        <h1 class="font-bold text-2xl mb5">LRC Tool</h1>
        <ul class="lh-7 text-#4DAAFC">
          <li class="cursor-pointer"><a class="flex items-center gap2" @click.prevent="createFile"><Icon class="w5 h5" name="mdi:file-outline"/>新建歌词...</a></li>
          <li class="cursor-pointer"><a class="flex items-center gap2" @click.prevent="useRouter().push('/')"><Icon class="w5 h5" name="mdi:search"/>前往搜索...</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-btns {
  button.active {
    border-bottom: 0;
    background: #fff;
    .dark & {
      background: #1F1F1F;
    }
  }
}
.lyric-files {
  button.active {
    background: #ddd;
    .dark & {
      background: #37373D;
    }
  }
}
</style>