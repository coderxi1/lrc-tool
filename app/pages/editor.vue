<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEditorStore, LyricFile } from '@/stores/editor'

const editorStore = useEditorStore()
const route = useRoute()

// 当前选中的文件 ID
const currentFileId = ref<string | null>(null)
const currentFile = ref<LyricFile | null>(null)

// textarea 的 ref
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 初始化选中文件
onMounted(() => {
  const id = route.query.id as string | undefined
  if (id) {
    currentFileId.value = id
  }
})

// 当选中 ID 改变时更新 currentFile
watch(currentFileId, async (id) => {
  currentFile.value = editorStore.lyricFiles.find(f => f.id === id) || null
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.focus()
    textareaRef.value.selectionStart = textareaRef.value.selectionEnd = textareaRef.value.value.length
  }
})
</script>

<template>
  <div class="flex h-screen p-4 gap-4 border rounded-lg dark:border-gray-600 dark:bg-gray-900">
    <!-- 左侧文件列表 -->
    <div class="w-1/4 border-r border-gray-300 pr-2 dark:border-gray-700">
      <h2 class="font-bold mb-2 text-gray-800 dark:text-gray-200">歌词文件</h2>
      <div v-for="file in editorStore.lyricFiles" :key="file.id" class="mb-2">
        <button
          class="w-full text-left p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{'bg-gray-200 dark:bg-gray-700': currentFileId === file.id, 'text-gray-900 dark:text-gray-100': true}"
          @click="currentFileId = file.id"
        >
          {{ file.name }}
        </button>
      </div>
    </div>

    <!-- 右侧编辑区 -->
    <div class="flex-1 flex flex-col">
      <h2 class="font-bold mb-2 text-gray-800 dark:text-gray-200">编辑歌词</h2>
      <textarea
        v-if="currentFile"
        ref="textareaRef"
        v-model="currentFile.lrc"
        class="w-full h-full border rounded p-2 resize-none
               border-gray-300 dark:border-gray-600
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-gray-100
               focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
      ></textarea>
      <div v-else class="text-gray-400 dark:text-gray-500">请选择左侧文件进行编辑</div>
    </div>
  </div>
</template>
