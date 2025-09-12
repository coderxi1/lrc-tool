<template>
  <nav class="flex items-center justify-end py-10 px-6">
    <div class="flex items-center gap-5">
      <button class="btn-circle" @click="useRouter().push('/')">
        <Icon name="mdi:home" class="w6 h6" />
      </button>
      <button class="btn-circle" @click="switchTheme">
        <Icon :name="themeIcon" class="w6 h6" />
      </button>
      <button class="btn-circle" @click="goGithub">
        <Icon name="mdi:github" class="w6 h6" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const cm = useColorMode()
const themes = ['dark', 'light', 'system']
const themeIcon = computed(() => 'theme-' + cm.preference)

const switchTheme = () => {
  const currentIndex = themes.indexOf(cm.preference)
  cm.preference = themes[(currentIndex + 1) % themes.length]!
}

const goGithub = () => window.open("https://github.com/coderxi1/lrc-tool", "_blank")
</script>
