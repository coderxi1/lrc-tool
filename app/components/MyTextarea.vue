<template>
  <div
    class="relative flex flex-col w-full bg-white border border-gray-300 rounded-lg dark:bg-[#1a1a1a] dark:border-[#555] group"
  >
    <!-- 文本框 -->
    <textarea
      v-model="modelValue"
      placeholder="暂无歌词"
      class="
        w-full min-h-1rem h-full p-2 text-base font-mono
        outline-none resize-none transition-all duration-300
        text-gray-800 placeholder:text-gray-400
        dark:text-[#eee] dark:placeholder:text-gray-500
        bg-white dark:bg-[#1a1a1a]
        rounded-lg
        whitespace-nowrap overflow-x-auto
      "
    ></textarea>

    <!-- 复制按钮 (hover 时显示) -->
    <button
      @click="copyText"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
             text-xs p1 rounded-md shadow b"
    >
      {{ copied ? "已复制" : "复制" }}
    </button>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<string>()
const copied = ref(false)

const copyText = async () => {
  if (!modelValue.value) return
  try {
    await navigator.clipboard.writeText(modelValue.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1000)
  } catch (err) {
  }
}
</script>

<style lang="scss" scoped>
  ::-webkit-scrollbar {
    width: 5px;
  }
</style>