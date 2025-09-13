<script setup lang="ts">
import { useEditorStore, LyricFile } from '@/stores/editor'

const editorStore = useEditorStore()
const activeTab = ref(1)
</script>

<template>
  <div class="wfull max-w-1400px m-auto flex flex-1 rounded-lg b dark:b-#333 bg-white dark:bg-#181818 overflow-hidden">
    <!-- 歌词列表 -->
    <div class="min-w-16em flex flex-col b-r bg-#f5f5f5 dark:b-#333 dark:bg-#181818">
      <div class="font-bold h12 px-4 lh-12 b-b-1 dark:b-#222">歌词列表</div>
      <div class="flex flex-col py2">
        <input class="w-full text-left cursor-pointer pl-4 py1.5 hover:bg-black/10 dark:hover:bg-white/8"
               type="button" v-for="file in editorStore.lyricFiles" :key="file.name" :value="file.name">
      </div>
    </div>

    <!-- 编辑区 -->
    <div class="flex-1 flex flex-col dark:bg-#1F1F1F">
      <div class="tab-btns flex h12 bg-#f5f5f5 dark:bg-#181818">
        <button class="flex h12 gap2 items-center px7 b-b b-r dark:b-#333" @click="activeTab = 1" :class="{ active: activeTab === 1 }"><Icon class="w6 h6" name="mdi:text-box-edit-outline"/>文本</button>
        <button class="flex h12 gap2 items-center px7 b-b b-r dark:b-#333" @click="activeTab = 2" :class="{ active: activeTab === 2 }"><Icon class="w6 h6" name="mdi:playlist-plus"/>打轴</button>
        <button class="flex h12 gap2 items-center px7 b-b b-r dark:b-#333" @click="activeTab = 3" :class="{ active: activeTab === 3 }"><Icon class="w6 h6" name="mdi:credit-card-edit-outline"/>调整</button>
        <div class="flex-1 b-b dark:b-#333"></div>
      </div>
      <div class="p4">
        <div v-show="activeTab === 1">文本编辑器</div>
        <div v-show="activeTab === 2">打轴编辑器</div>
        <div v-show="activeTab === 3">调整编辑器</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-btns {
  button.active {
    border-bottom: 0;
    background: #1F1F1F;
  }
}
</style>