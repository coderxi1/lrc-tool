<script setup lang="ts">
import WaveSurfer from 'wavesurfer.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import type { AudioInfo } from '~/types';

const props = defineProps<{
  audio?: AudioInfo
  lines: LrcLine[]
  time: number,
}>()

const root = ref<HTMLElement>()
const waveformEl = ref<HTMLElement>()
const waveform = ref<WaveSurfer>()
const duration = ref(0)

watch(() => props.audio, (audio) => { if (audio) waveform.value?.load(audio.playurl) }, { immediate: true })
onMounted(() => {
  waveform.value = WaveSurfer.create({
    container: waveformEl.value!,
    waveColor: '#ddd',
    progressColor: '#4f46e5',
    cursorColor: '#ff0000',
    height: 80,
    plugins: [
      TimelinePlugin.create(),
    ],
  })
  if (props.audio) {
    waveform.value.load(props.audio.playurl)
  }
  waveform.value.on('ready', () => {
    duration.value = waveform.value!.getDuration() || 0
  })
  //控制alt键调整width
  let zoomLevel = 50
  waveformEl.value!.addEventListener('wheel', (e: WheelEvent) => {
    if (!e.altKey) return
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomLevel = Math.min(zoomLevel + 10, 500)
    } else {
      zoomLevel = Math.max(zoomLevel - 10, 20)
    }
    waveform.value?.zoom(zoomLevel)
  }, { passive: false })
})
onBeforeUnmount(() => {
  if (waveform.value) {
    try { waveform.value.destroy() } catch {}
    waveform.value = undefined
  }
})
watch(() => props.time, (time) => {
  if (!waveform.value || !duration.value) return
  let current = waveform.value.getCurrentTime()
  if (Math.abs(current - time) < 0.05) return
  waveform.value.seekTo(Math.max(0, Math.min(1, time / duration.value)))
})

const activeIndex = computed(() => {
  const arr = props.lines
  if (!arr.length) return 0
  let left = 0, right = arr.length - 1, t = props.time
  let idx = 0
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (t >= arr[mid]!.time) {
      idx = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return idx
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div ref="root" class="w-full border border-gray-300 dark:b-#333 h-30">
      <div ref="waveformEl"></div>
    </div>
  </div>
</template>