<script setup lang="ts">
import Footer from './Footer.vue'
import MainHeader from './Header.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen items-center">
    <MainHeader />
    <main class="p-6 max-w-7xl flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>
