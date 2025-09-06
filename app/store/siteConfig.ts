import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSiteConfigStore = defineStore('siteConfig', () => {
  const theme = ref<'light' | 'dark' | 'auto'>('auto')
  return { theme }
})
