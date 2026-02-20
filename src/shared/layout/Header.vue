<script setup lang="ts">
import Breadcrumb, { type BreadcrumbItem } from '../ui/Breadcrumb.vue'

defineProps<{
  title: string
  crumbs: BreadcrumbItem[]
}>()
</script>
<template>
  <div class="my-6">
    <h1 class="text-2xl font-semibold">{{ title }}</h1>
    <Breadcrumb :items="crumbs" />
  </div>
</template>
