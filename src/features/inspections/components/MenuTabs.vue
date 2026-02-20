<script setup lang="ts">
import Tabs, { type Tab } from '@/shared/ui/Tabs.vue'

defineProps<{
  counts: Record<string, number>
  tabs: Tab[]
}>()

defineModel('activeTab')
</script>

<template>
  <Tabs
    :tabs="tabs"
    :activeTab="activeTab"
    @update:activeTab="(val) => $emit('update:activeTab', val)"
  />

  <!-- TODO(feature): add badge for counts -->
</template>
