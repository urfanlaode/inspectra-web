<script setup lang="ts">
import Button from '@/shared/ui/Button.vue'
import { FileDown, Search } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center gap-2">
    <Button title="Search" variant="icon" class="text-primary" disabled>
      <Search class="h-4 w-4" />
    </Button>
    <Button title="Export" variant="secondary" class="text-primary" disabled
      ><template #left><FileDown class="w-4 h-4" /></template>Export</Button
    >
  </div>
</template>
