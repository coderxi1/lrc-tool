import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const theme = ref<'light' | 'dark' | 'auto'>('auto')
  watch(theme, (t) => {
    const htmlclass = document.documentElement.classList
    htmlclass.remove('light', 'dark')
    htmlclass.add(t != 'auto' ? t : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    localStorage.setItem('theme', t)
  })
  return { theme }
})
