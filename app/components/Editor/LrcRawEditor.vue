<script setup lang="ts">
const modelValue = defineModel<string>()
</script>

<template>
  <div class="h-full">
    <MyTextarea class="h-full" v-model="modelValue"></MyTextarea>
  </div>
</template>