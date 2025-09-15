<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  time: number
}>()

const emit = defineEmits(['update:modelValue'])
const lrcObj = reactive(new Lrc())
const updateModelValue = ()=> {
  emit('update:modelValue',lrcObj.format({meta:true}))
}

watch(() => props.modelValue, (lrc) => Object.assign(lrcObj,Lrc.from(lrc.trim())), { immediate: true })

const root = ref<HTMLDivElement>()
const focusLine = (index: number) => root.value?.children[index]?.querySelector('input')?.focus()

const setTime = (line: LrcLine, index: number) => {
  line.time = props.time
  if (index < lrcObj.lines.length - 1) {
    focusLine(index + 1)
  }
  updateModelValue()
}
</script>

<template>
  <div ref="root" class="text-lg overflow-y-auto max-h-185">
    <div v-for="(line, i) in lrcObj.lines" :key="i" class="flex items-center justify-between">
      <span class="w-16 text-sm text-maincolor text-right mr-2 font-bold">{{ Lrc.formatTime(line.time) }}</span>
      <input type="text" class="flex-1 bg-transparent outline-0 focus:b-b" @keydown="e=>e.preventDefault()" @keydown.enter="setTime(line, i)"
        :value="line.text" />
    </div>
  </div>
</template>
