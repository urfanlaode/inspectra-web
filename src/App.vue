<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './shared/layout/MainLayout.vue'

const route = useRoute()

const layout = computed(() => {
  switch (route.meta.layout) {
    default:
      return MainLayout
  }
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
