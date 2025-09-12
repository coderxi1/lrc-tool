<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen w-full max-w-1000px flex flex-col m-auto text-dark dark:text-light">
    <header class="w-full">
      <Navbar/>
    </header>
    <main class="w-full flex-1 px-1">
      <slot></slot>
    </main>
    <footer class="w-full text-center py8">
      <p>Copyright © 2025 ~ 2025 By 汐涌及岸. All rights reserved.</p>
    </footer>
  </div>
</template>
