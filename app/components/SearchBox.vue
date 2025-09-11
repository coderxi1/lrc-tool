<template>
  <div class="flex items-center w-full h-12 bg-white dark:bg-#4D5156 rounded-full px-2 shadow-md focus-within:shadow-lg transition-shadow duration-500">
    <div class="relative">
      <button class="btn-circle" @click="toggleDropdown">
        <Icon :name="dropdownIcon" class="w-6 h-6" />
      </button>
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-show="dropdownShow" ref="dropdownRef" class="absolute top-12 left-0 bg-white dark:bg-#4D5156 rounded-lg py-2 w-40 shadow-md">
          <div v-for="option in dropdownOptions" :key="option.value" @click="onDropdownSelect(option.value)" class="px-4 py-2 hover:bg-black/10 dark:hover:bg-white/8 cursor-pointer flex items-center gap-2 transition-colors duration-300">
            <Icon :name="option.icon" class="w-5 h-5" />
            <span class="">{{ option.label }}</span>
          </div>
        </div>
      </Transition>
    </div>
    <input v-model="value" type="text" placeholder="" class="flex-1 bg-transparent px-3 outline-0" @keydown.enter="doSearch" />
    <button class="btn-circle" @click="doSearch">
      <Icon name="mdi:magnify" class="w-6 h-6" />
    </button>
  </div>
</template>

<script lang="ts" setup>

const value = defineModel<string>()

const props = defineProps<{ 
  dropdownOptions: {label:string,value:string,icon:string}[]
  dropdownValue: string
}>()
const emit = defineEmits<{
  (e: 'update:dropdownValue', value: string): void
  (e: 'input', value: string): void
  (e: 'search'): void
}>()

//dropdown
function onDropdownSelect(value: string) {
  emit('update:dropdownValue', value)
  dropdownShow.value = false
}
const dropdownIcon = computed(() => {
  const found = props.dropdownOptions.find(opt => opt.value === props.dropdownValue)
  return found ? found.icon : ''
})

import { onClickOutside } from '@vueuse/core'
const dropdownRef = ref<HTMLElement>()
const dropdownShow = ref(false)
const toggleDropdown = () => {dropdownShow.value = !dropdownShow.value }
onClickOutside(dropdownRef, () => {dropdownShow.value = false})

//search
const doSearch = () => {
  emit('search')
}

</script>
