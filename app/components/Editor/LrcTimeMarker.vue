<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  time: number
}>()

const emit = defineEmits(['update:modelValue'])

const lines = ref<LrcLine[]>([])
const updateModelValue = ()=> {
  const lrc = new Lrc()
  lrc.lines = lines.value
  emit('update:modelValue',lrc.format({meta:true}))
}

watch(() => props.modelValue, (lrc) => { lines.value = Lrc.from(lrc.trim()).lines.filter(l => l.raw) }, { immediate: true })

const root = ref<HTMLDivElement>()
const focusLine = (index: number) => root.value?.children[index]?.querySelector('input')?.focus()

const setTime = (line: LrcLine, index: number) => {
  line.time = props.time
  if (index < lines.value.length - 1) {
    focusLine(index + 1)
  }
  updateModelValue()
}

</script>

<template>
  <div ref="root" class="text-lg overflow-y-auto max-h-185">
    <div v-for="(line, i) in lines" :key="i" class="flex items-center justify-between">
      <span class="w-16 text-sm text-maincolor text-right mr-2 font-bold">{{ Lrc.formatTime(line.time) }}</span>
      <input type="text" class="flex-1 bg-transparent outline-0 focus:b-b" @keydown.enter="setTime(line, i)"
        :value="line.text" />
    </div>
  </div>
</template>
