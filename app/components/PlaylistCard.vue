<script lang="ts" setup>
defineProps<{
  playlist: WithSongs<Playlist>
}>();
</script>

<template>
  <div class="flex items-center gap-4 py4 px8 rounded-lg bg-white dark:bg-white/10 shadow-sm wfull">
    <img :src="playlist.cover" :alt="playlist.name" class="w-16 h-16 rounded-md object-cover flex-shrink-0" />
    <div class="flex flex-col gap-2 overflow-hidden">
      <h2 class="text-lg font-semibold truncate">{{ playlist.name }}</h2>
      <div class="flex items-center text-sm truncate text-#aaa dark:text-#999">
        <Icon name="mdi:account" class="w4 h4 mr1"/> <span class="mr3">{{ playlist.creator }}</span>
        <Icon name="mdi:music" class="w4 h4 mr1"/> <span class="mr3">{{ playlist.songsTotal }} 首歌曲 </span>
      </div>
    </div>
  </div>
</template>