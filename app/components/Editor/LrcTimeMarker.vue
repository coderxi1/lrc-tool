<script setup lang="ts">
const props = defineProps<{
  lines: LrcLine[]
  time: number
  refresh: () => void
}>()

const root = ref<HTMLDivElement>()

const focus = (index: number) => {
  const rootEl = root.value!
  let i = index < props.lines.length ? index : 0
  while (true) {
    const lineEl = rootEl.children[i] as HTMLDivElement
    if (lineEl?.style.display !== 'none') {
      lineEl?.querySelector('input')?.focus()
      break
    } else {
      if (++i >= props.lines.length) {
        i = 0
      }
    }
  }
}

const setTime = (line: LrcLine, index: number) => {
  line.time = props.time
  focus(index + 1)
  props.refresh()
}



const tip =`
食用方法：
 1. 播放音频
 2. 点击一行歌词
 3. 按下回车
`
</script>

<template>
  <div class="flex">
    <div ref="root" class="w-4/5 text-lg overflow-y-auto max-h-185" v-if="lines?.length">
      <div v-for="(line, i) in lines" :key="i" class="flex items-center justify-between gap-2" v-show="line.raw">
        <span class="text-md text-maincolor flex justify-center">[{{ Lrc.formatTime(line.time)||'暂无时间'}}]</span>
        <input type="text" class="flex-1 bg-transparent b-b b-transparent outline-0 focus:b-maincolor" @keydown="e => e.preventDefault()"
          @keydown.enter.prevent="setTime(line, i)" :value="line.text" />
      </div>
    </div>
    <div class="b-l-2 pl3 ml3 dark:b-#333"><pre v-text="tip"></pre></div>
  </div>
</template>