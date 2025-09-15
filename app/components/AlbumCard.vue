<script lang="ts" setup>
defineProps<{
  album: WithSongs<Album>
}>();
</script>

<template>
  <div class="flex items-center gap-4 py4 px2 md:px8 rounded-lg bg-white dark:bg-white/10 shadow-sm wfull">
    <span class="relative inline-block mr3">
      <img class="w100px h100px min-w100px" loading="lazy" :src="album.cover" :alt="album.name" />
      <i class="w115px h100px bg-cover bg-no-repeat bg-left-top absolute top-0 left-0 bgi-[url(/images/album_cover_mask.png)]"></i>
    </span>
    <div class="flex flex-col gap-2 overflow-hidden">
      <h2 class="text-lg font-semibold truncate">{{ album.name }}<span v-if="album.alias">({{ album.alias }})</span></h2>
      <div class="flex items-center text-sm truncate text-#aaa dark:text-#999">
        <Icon v-if="album.artists?.length && album.artists.length<=1 " name="mdi:account" class="w4 h4 mr1" />
        <Icon v-else name="mdi:account-group" class="w4 h4 mr1" />
        <span class="mr3">{{ album?.artists.join(' / ') || '-' }}</span>
      </div>
      <div class="flex items-center text-sm truncate text-#aaa dark:text-#999">
        <Icon name="mdi:music" class="w4 h4 mr1" />
        <span class="mr3">{{ album.songsTotal }} 首歌曲 </span>
      </div>
    </div>
  </div>
</template>