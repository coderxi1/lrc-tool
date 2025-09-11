<script setup lang="ts">

export interface SimpleBtn<T = any> {
  label: string
  onclick: (data: T, el:HTMLButtonElement) => void | Promise<void>
}

defineProps<{
  songs: Song[],
  btns: SimpleBtn<Song>[]
}>()
const alert = (s:string) => window.alert(s)
</script>

<template>
  <div class="song-list w-full">
    <!-- 表头 -->
    <div class="h12 items-center p2 b-b b-b-#ddd dark:b-b-dark mb2 hidden md:flex">
      <div class="w14">#</div>
      <div class="flex-1 truncate">标题</div>
      <div class="w66 truncate">专辑</div>
      <div class="w20"></div>
    </div>

    <!-- 列表 -->
    <div>
      <div v-for="(song, index) in songs" :key="song.platformId" class="flex items-center px2 py3 hoverbg rounded-lg cursor-default">
        <!-- 序号 -->
        <div class="hidden md:block w14 select-none">{{ String(index + 1).padStart(2, '0') }}</div>

        <!-- 标题 + 封面 + 艺术家 -->
        <div class="flex-1 flex items-center min-w-0">
          <img v-if="song.cover" :src="song.cover" alt="cover" class="w12 h12 rounded-md mr-2 object-cover flex-shrink-0 select-none" loading="lazy"/>
          <div class="truncate">
            <div class="font-md truncate pr6">
              {{ song.name || song.title }}
              <span v-if="song.alias" class="text-sm ml-1 truncate text-#aaa dark:text-#999">({{ song.alias.replace(/^\(|\)$/g, '') }})</span>
            </div>
            <div class="text-sm mt-1 truncate text-#aaa dark:text-#999">
              <span v-if="song.artists" v-for="(artist, i) in song.artists" :key="i" class="truncate">
                {{ artist }}<span v-if="i < song.artists.length - 1" class="mx-1">/</span>
              </span>
              <!-- 手机端专辑放在这里 -->
              <span class="inline md:hidden">
                {{ song.album ? ` - ${song.album}` : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 专辑 -->
        <div class="hidden md:block w-66 truncate text-xs text-#aaa dark:text-#999">{{ song.album || '-' }}</div>

        <!-- 按钮 -->
        <div class="w-20 flex-shrink-0 flex justify-end">
          <button v-for="btn in btns" class="b b-maincolor text-maincolor px1.5 py0.5 rounded-md text-xs disabled:opacity-50 disabled:pointer-events-none" @click="btn.onclick(song,$event.target as any)">{{ btn.label }}</button>
        </div>
      </div>
    </div>
  </div>
</template>