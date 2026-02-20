<script setup lang="ts">
import Footer from './Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen items-center">
    <main class="min-w-2xl max-w-7xl w-full flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>
