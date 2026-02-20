<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
  separator?: string
}>()

const { items } = props

const isCurrent = computed(() => (index: number) => index === items.length - 1)
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-sm text-muted font-medium">
    <ol class="flex gap-1 items-center">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1">
        <component
          :is="item.to ? RouterLink : 'span'"
          :to="item.to"
          v-if="item.to"
          class="hover: transition-colors"
        >
          {{ item.label }}
        </component>

        <span v-else class="font-bold text-gray-900">{{ item.label }}</span>

        <span v-if="!isCurrent(index)" aria-hidden="true">
          <ChevronRight class="h-3 w-3" />
        </span>
      </li>
    </ol>
  </nav>
</template>
