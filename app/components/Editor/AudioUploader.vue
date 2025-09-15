<template>
  <div class="flex items-center justify-center b-2 border-dashed rounded-lg cursor-pointer"
    @click="onUploadClick">
    <input type="file" ref="fileInput" accept="audio/*" class="hidden" @change="onFileChange" />
    <span class="text-maincolor">点击上传音乐文件</span>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', file: File): void
}>()
const fileInput = ref<HTMLInputElement>()
function onUploadClick() {
  fileInput.value?.click()
}
function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length && files[0]) {
    emit('change', files[0])
  }
}
</script>