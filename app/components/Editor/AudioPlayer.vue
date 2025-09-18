<template>
  <div class="flex flex-col relative">

    <audio ref="audioEl" :src="audio?.playurl" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMeta"
      @ended="player.playing = false"></audio>
      
    <input type="range" min="0" :max="player.duration" step="0.01" v-model="player.seekTime" @input="onSeek"
      class="slider" />

    <div class="flex items-center">

      <div class="flex-1 flex items-center gap-4 p3">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
          <img v-if="audio?.cover" :src="audio?.cover" class="full object-cover" />
          <div v-else class="flex items-center text-maincolor">
            <Icon class="w7 h7" name="mdi:music" />
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-2 overflow-hidden">
          <h2 class="text-lg font-semibold truncate">{{ audio?.title || '未知标题' }}</h2>
          <p class="flex items-center text-sm truncate text-#aaa dark:text-#999">{{ audio?.artist || '未知艺术家' }}</p>
        </div>
      </div>

      <div class="flex-1 flex justify-center">
        <button class="bg-maincolor rounded-full flex items-center content-center p2" @click="togglePlay">
          <Icon class="w7 h7 text-white" :name="player.playing ? 'mdi:pause' : 'mdi:play'" />
        </button>
      </div>

      <div class="flex-1 flex items-center justify-end gap3 p3">
        <span>{{ formatTime(player.currentTime) }} / {{ formatTime(player.duration) }}</span>
        <slot name="end"></slot>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioInfo } from '~/types';

defineProps<{ audio?: AudioInfo }>()
const emit = defineEmits<{(e: 'timeupdate', t: number): void}>()

const audioEl = ref<HTMLAudioElement | null>(null)

const player = reactive({
  playing: false,
  currentTime: 0,
  duration: 0,
  seekTime: 0
})

function togglePlay() {
  if (!audioEl.value) return
  if (audioEl.value.paused) {
    audioEl.value.play()
    player.playing = true
  } else {
    audioEl.value.pause()
    player.playing = false
  }
}

function onTimeUpdate() {
  if (!audioEl.value) return
  const { currentTime } = audioEl.value
  player.currentTime = currentTime
  player.seekTime = currentTime
  emit('timeupdate', currentTime)
}

function onLoadedMeta() {
  if (!audioEl.value) return
  player.duration = audioEl.value.duration || 0
}

function onSeek() {
  if (!audioEl.value) return
  audioEl.value.currentTime = player.seekTime
}

function formatTime(sec: number) {
  if (!isFinite(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.slider {
  position: absolute;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  border-radius: 0;
  background: #ddd;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 8px;
    height: 8px;
    background: #fff;
    border: solid 1px#999;
    border-radius: 50%;
    cursor: pointer;
  }

  &:hover {
    height: 8px;
    &::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
    }
  }
  
}
</style>