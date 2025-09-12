<template>
  <div>
    <div class="text-center md:mt-40 mb-10">
      <h1 class="font-bold my-5 text-[28px] font-semibold">LRC Tool</h1>
      <p>输入音乐/歌单/专辑的链接即可开始</p>
    </div>
    <SearchBox :dropdown-value="platform.name" @update:dropdown-value="(v)=>{platform = usePlatform(v)}"
      :dropdown-options="Object.values(platforms).map(p => ({ value: p.name, label: p.label, icon: p.icon }))"
      v-model="input"
      @search="doSearch" />
    <div class="flex justify-center gap-4 mt7 text-sm">
      <button class="bg-#fff shadow-sm b b-transparent hover:b-#ddd dark:hover:b-#666 dark:bg-#303134 transition-[border-color] py2 px4 rounded-lg" @click="doSearch">搜索歌词</button>
      <button class="bg-#fff shadow-sm b b-transparent hover:b-#ddd dark:hover:b-#666 dark:bg-#303134 transition-[border-color] py2 px4 rounded-lg" @click="useRouter().push('/editor')">编辑歌词</button>
    </div>
    <Transition enter-active-class="transition-all duration-400 ease-in-out" enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-400 ease-in-out"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="resultShow" class="p1">
        <div v-if="result.albums && result.albums.length" class="mt-8">
          <h1 class="font-bold text-lg">专辑</h1>
          <div class="flex flex-col gap-1 mt4">
            <AlbumCard v-for="(album, i) in result.albums" :key="i" :album="album" />
          </div>
        </div>
        <div v-if="result.playlists && result.playlists.length" class="mt-8">
          <h1 class="font-bold text-lg">歌单</h1>
          <div class="flex flex-col gap-1 mt4">
            <PlaylistCard v-for="(playlist, i) in result.playlists" :key="i" :playlist="playlist" />
          </div>
        </div>
        <div v-if="result.songs && result.songs.length" class="mt-8">
          <h1 class="font-bold text-lg">单曲</h1>
          <SongList :songs="result.songs" class="mt4 md:mt0" :btns="btns" />
        </div>
      </div>
    </Transition>
  </div>
  <ModalsContainer />
</template>

<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import { type Platform } from '~/api/platforms'
import { usePlatform,platforms } from '~/api/'
import type { SimpleBtn } from '~/components/SongList.vue'
import ModalLyricsPreview from '~/components/ModalLyricsPreview.vue'

//当前选择的平台
const platform = ref<Platform>(usePlatform('qq'))

//model
const input = ref<string>('')

watch(input, async (value) => {
  if (isUrl(value)) {
    //根据url自动匹配平台
    const url = new URL(value.trim())
    const host = url.hostname
    const matched = Object.values(platforms).find((p) => p.domains.some((d) => host.includes(d)))
    if (!matched) return
    platform.value = matched
  }
})

const result = reactive<SearchResult>({})
const resultShow = computed(() => result.albums?.length || result.playlists?.length || result.songs?.length)
async function doSearch() {
  result.albums = []
  result.playlists = []
  result.songs = []
  Object.assign(result,await platform.value.enhancedSearch(input.value))
}

//歌词展示
//list按钮
const btns: SimpleBtn[] = [
  {
    label: '歌词',
    onclick: async (song: Song, el: HTMLButtonElement) => {
      el.disabled = true
      const lyrics = await platform.value.getLyricsBySongId(song.platformId)
      el.disabled = false
      const modal = useModal({ component: ModalLyricsPreview, attrs: { lyrics, song, close:()=>modal.close() } })
      modal.open()
    }
  }
]
</script>
