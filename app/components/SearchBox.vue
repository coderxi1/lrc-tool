<template>
  <div class="flex items-center w-full h-12 bg-black/60 rounded-full px-2" ref="dropdownRef">
    <div class="relative">
      <button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 outline-0" @click="toggleDropdown">
        <Icon :name="platform.icon" class="w-6 h-6 text-white" />
      </button>
      <div v-if="showDropdown" class="absolute top-12 left-0 bg-black/80 rounded-lg shadow-lg py-2 w-40">
        <div v-for="p in platforms" :key="p.value" @click="selectPlatform(p)" class="px-4 py-2 text-white hover:bg-white/10 cursor-pointer flex items-center gap-2">
          <Icon :name="p.icon" class="w-5 h-5 text-gray-300" />
          <span>{{ p.label }}</span>
        </div>
      </div>
    </div>
    <input v-model="query" type="text" placeholder="" @input="handleInput" class="flex-1 bg-transparent outline-none text-white px-3" @keydown.enter="search" />
    <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 outline-0" @click="search">
      <Icon name="mdi:magnify" class="w-6 h-6 text-white" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const dropdownRef = ref(null)
const showDropdown = ref(false)
const toggleDropdown = () => {showDropdown.value = !showDropdown.value }
onClickOutside(dropdownRef, () => {showDropdown.value = false})

const platforms = [
  { label: '网易云音乐', value: 'netease', icon: 'custom:netease-music', domains: ['music.163.com', '163cn.tv'] },
  { label: 'QQ音乐', value: 'qq', icon: 'custom:qq-music', domains: ['music.qq.com', 'y.qq.com'] },
]

const platform = ref(platforms[1])
const query = ref('https://y.qq.com/n/ryqq/songDetail/107761762')

const selectPlatform = (p) => {
  platform.value = p
  showDropdown.value = false
}

const handleInput = () => {
  if (!isUrl(query.value)) return
  try {
    const url = new URL(query.value)
    const host = url.hostname
    const matched = platforms.find((p) => p.domains.some((d) => host.includes(d)))
    matched && (platform.value = matched)
  } catch (err) {}
}

const search = async () => {
  if (!query.value) return
  const params : SearchRequestQuery = {
    type: 'keyword',
    keyword: query.value,
    platform: platform.value!.value as SearchRequestQuery['platform']
  }
  const data = await fetch('/api/search?'+new URLSearchParams(params as any).toString()).then(r=>r.json())
  alert('【开发中】\n\n' + JSON.stringify(data,null,2))
}
</script>
