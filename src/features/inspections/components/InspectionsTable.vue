<script setup lang="ts">
import Table from '@/shared/ui/Table.vue'
import { format } from 'date-fns'
import { inspectionsTableMeta } from './InspectionsTable.constants'
import StatusChip from './StatusChip.vue'

defineProps<{
  data: Array<any>
}>()

defineEmits<{
  (e: 'create', payload: any): void
  (e: 'see-detail', row: any): void
}>()
</script>

<template>
  <Table
    :columns="inspectionsTableMeta.columns"
    :data="data"
    expandable
    expand-on-row-click
    single-expand
    @row-click="(row) => $emit('see-detail', row)"
  >
    <template #expanded-row="{ row }">
      <Table :columns="inspectionsTableMeta.lotColumns" :data="row.lots">
        <template #cell-itemName="{ row }">
          {{ row.lot.item.name }}
        </template>

        <template #cell-ownership="{ row }">
          {{ row.lot.owner.name }}
        </template>

        <template #cell-lotNo="{ row }">
          {{ row.lot.lotNumber }}
        </template>

        <template #cell-qty="{ row }">
          {{ row.qtyRequired }}
        </template>
      </Table>
    </template>

    <template #cell-inspectionNo="{ row }">
      {{ row.inspectionNo }}
    </template>

    <template #cell-locationName="{ row }">
      {{ row.location.name }}
    </template>

    <template #cell-scopeOfWorkName="{ row }">
      {{ row.scopeOfWork.name }}
    </template>

    <template #cell-serviceTypeName="{ row }">
      {{ row.serviceType.name }}
    </template>

    <template #cell-dateSubmitted="{ row }">
      {{ format(new Date(row.createdAt), 'dd MMM yyyy') }}
    </template>

    <template #cell-estimatedCompletionDate="{ row }">
      {{ format(new Date(row.estimatedCompletionDate), 'dd MMM yyyy') }}
    </template>

    <template #cell-status="{ row }">
      <div class="w-fit mx-auto">
        <StatusChip :status="row.status" size="sm" />
      </div>
    </template>
  </Table>
</template>
