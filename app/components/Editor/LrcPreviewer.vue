<script setup lang="ts">
const props = defineProps<{
  lrc: string
  time: number
}>()

const lines = ref<LrcLine[]>([])

watch(() => props.lrc, (lrc) => { lines.value = Lrc.from(lrc.trim()).lines }, { immediate: true })

const lineHeight = 2.5
const containerHeight = 20
const visibleLines = containerHeight / lineHeight

const currentIndex = computed(() => {
  const arr = lines.value
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

const activeIndexes = computed(() => {
  const idx = currentIndex.value
  const arr = lines.value
  const result = [idx]
  for (let i = idx - 1; i >= 0; i--) {
    if (arr[i]!.time === arr[idx]!.time) result.push(i)
    else break
  }
  for (let i = idx + 1; i < arr.length; i++) {
    if (arr[i]!.time === arr[idx]!.time) result.push(i)
    else break
  }
  return result
})

const offsetY = computed(() => {
  const centerOffset = (visibleLines / 2 - 0.5) * lineHeight
  let y = -(currentIndex.value * lineHeight - centerOffset)
  const totalHeight = lines.value.length * lineHeight
  if (totalHeight <= containerHeight) {
    return 0
  } else {
    const maxOffset = 0
    const minOffset = -(totalHeight - containerHeight)
    return Math.max(Math.min(y, maxOffset), minOffset)
  }
})

</script>

<template>
  <div class="overflow-hidden flex items-center justify-center">
    <div
      class="transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateY(${offsetY}rem)` }"
    >
      <div
        v-for="(line, i) in lines"
        :key="i"
        class="text-center text-gray-400 text-xl leading-[2.5rem] transition-colors duration-300"
        :class="{
          'dark:text-white text-dark font-bold text-xl': activeIndexes.includes(i)
        }"
      >
        {{ line.text || '　' }}
      </div>
    </div>
  </div>
</template>