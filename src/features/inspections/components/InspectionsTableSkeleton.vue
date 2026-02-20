<script setup lang="ts">
import Table from '@/shared/ui/Table.vue'
import { inspectionsTableMeta } from './InspectionsTable.constants'
</script>

<template>
  <Table :columns="inspectionsTableMeta.columns" :data="[{}, {}, {}, {}, {}]">
    <template
      v-for="column in inspectionsTableMeta.columns"
      :key="column.key"
      v-slot:[`cell-${column.key}`]
    >
      <div class="h-4 bg-gray-200 rounded col-span-1 animate-pulse"></div>
    </template>
  </Table>
</template>
