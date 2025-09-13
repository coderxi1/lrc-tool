<script setup lang="ts">
import Navbar from '~/components/Navbar.vue';
</script>

<template>
  <div class="min-h-screen w-full flex flex-col text-dark dark:text-light">
    <header class="w-full max-w-1000px m-auto">
      <Navbar/>
    </header>
    <main class="w-full flex-1 px-1 m-auto flex flex-col">
      <slot></slot>
    </main>
    <footer class="w-full text-center text-sm py8">
      <p>Copyright © 2025 ~ 2025 By 汐涌及岸. All rights reserved.</p>
    </footer>
  </div>
</template>
