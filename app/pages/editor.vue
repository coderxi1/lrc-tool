<script setup lang="ts">
import LrcEditor from '@/components/Editor/app.vue'


</script>

<template>
  <div
    class="wfull max-w-1400px max-h-900px m-auto flex flex-1 rounded-lg b dark:b-#333 bg-white dark:bg-#181818 overflow-hidden shadow-md">
    <!-- 歌词列表 -->
    <!-- <div class="min-w-16em flex flex-col b-r bg-#f5f5f5 dark:b-#333 dark:bg-#181818">
      <div class="font-bold h12 px-4 lh-12 b-b-1 dark:b-#222">歌词列表</div>
      <div class="lyric-files flex flex-col py2">
        <button class="w-full text-left cursor-pointer pl-4 py1.5 hover:bg-black/4 dark:hover:bg-white/4"
          v-for="(file,index) in editorStore.lyricFiles" :key="index" @click="currentLyricFile = file"
          :class="{ active: currentLyricFile === file }">{{ file.name }}</button>
      </div>
    </div> -->

    <!-- 编辑区 -->
    <LrcEditor/>
  </div>
</template>

<style lang="scss" scoped>
.lyric-files {
  button.active {
    background: #ddd;
    .dark & {
      background: #37373D;
    }
  }
}
</style>