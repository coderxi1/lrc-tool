<script lang="ts" setup>
defineProps<{
  song: Song
}>();
</script>

<template>
  <div class="flex items-center gap-4 py2 wfull">
    <!-- 封面 -->
    <img :src="song.cover" :alt="song.name" class="w-16 h-16 rounded-md object-cover flex-shrink-0" />

    <!-- 文字部分 -->
    <div class="flex flex-col gap-2 overflow-hidden">
      <!-- 标题 -->
      <h2 class="text-lg font-semibold truncate">{{ song.name }}</h2>
      <!-- 作者 + 歌曲数 -->
      <div class="flex items-center text-sm truncate text-#aaa dark:text-#999">
        <Icon name="mdi:account" class="w4 h4 mr1"/> <span class="mr3">{{ song.artists?.join(' / ') || '-' }}</span>
        <Icon name="mdi:album" class="w4 h4 mr1"/> <span class="mr3">专辑：{{ song.album }}</span>
      </div>
    </div>
  </div>
</template>