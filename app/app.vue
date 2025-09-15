<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Buffer } from 'buffer'
if (import.meta.client) window.Buffer = Buffer
</script>