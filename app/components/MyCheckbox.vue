<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  label: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const checked = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});
</script>

<template>
  <label class="flex items-center gap-1 cursor-pointer select-none">
    <div
      class="w-5 h-5 flex items-center justify-center rounded-md border
             transition-all duration-200 ease-in-out
             border-gray-300 dark:border-maincolor
             bg-white dark:bg-gray-800"
    >
      <transition
        enter-active-class="transition transform duration-200 ease-out"
        enter-from-class="opacity-0 scale-50"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition transform duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-50"
      >
        <svg
          v-if="checked"
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 24 24"
          :class="'stroke-maincolor'"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </transition>
    </div>
    <span class="text-#aaa dark:text-#999" :class="checked?'text-maincolor dark:text-maincolor':''">{{ label }}</span>
    <input type="checkbox" v-model="checked" class="hidden" />
  </label>
</template>
