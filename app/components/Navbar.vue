<template>
  <nav class="flex items-center justify-between py-4 px-6">
    <div></div>

    <!-- 右边图标 -->
    <div class="flex items-center gap-4">
      <!-- 夜间模式按钮 -->
      <Icon
        name="mdi:moon-waxing-crescent"
        class="w-6 h-6 cursor-pointer hover:opacity-70 transition"
        @click="toggleDark"
      />

      <!-- Github 按钮 -->
      <Icon
        name="mdi:github"
        class="w-6 h-6 cursor-pointer hover:opacity-70 transition"
        @click="goGithub"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue"

const isDark = ref(false)

// 切换主题
function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle("dark", isDark.value)
}

// 跳转到 Github
function goGithub() {
  window.open("https://github.com/coderxi1/lrc-tool", "_blank")
}
</script>
