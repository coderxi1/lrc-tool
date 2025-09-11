<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface Option {
  label: string;
  value: string;
  icon?: string; // 可选图标
}

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  options: Option[]
  class?: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const isOpen = ref(false);
const selected = ref(props.modelValue || '');

// 监听父组件传入的 modelValue，保持同步
watch(() => props.modelValue, (newVal) => {
  selected.value = newVal || '';
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option: Option) {
  selected.value = option.value;
  emit('update:modelValue', option.value);
  isOpen.value = false;
}

</script>

<template>
  <div class="relative w-60" :class="class">
    <!-- 选择框 -->
    <div 
      class="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer bg-#f6f6f6 dark:bg-#2f2f2f transition-colors duration-300 select-none"
      @click="toggleDropdown"
    >
      <span class="text-gray-700 dark:text-gray-200">
        {{ selected ? options.find(o => o.value === selected)?.label : placeholder }}
      </span>
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300" :class="{'rotate-180': isOpen}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>

    <!-- 下拉列表 -->
    <ul 
      v-show="isOpen" 
      class="absolute z-10 mt-2 w-full bg-white b border-gray-300 dark:border-gray-700  dark:bg-[#4D5156] shadow-md max-h-60 overflow-y-auto"
    >
      <li 
        v-for="option in options" 
        :key="option.value" 
        @click="selectOption(option)"
        class="px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-black/10 dark:hover:bg-white/8 transition-colors duration-300 select-none"
      >
        <template v-if="option.icon">
          <Icon :name="option.icon" class="w-5 h-5"/>
        </template>
        <span>{{ option.label }}</span>
      </li>
    </ul>
  </div>
</template>
