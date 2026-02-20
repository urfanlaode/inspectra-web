<script setup lang="ts">
import { router } from '@/app/router'
import Header from '@/shared/layout/Header.vue'
import Button from '@/shared/ui/Button.vue'
import { Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import InspectionsTable from '../components/InspectionsTable.vue'
import InspectionsTableSkeleton from '../components/InspectionsTableSkeleton.vue'
import MenuActions from '../components/MenuActions.vue'
import MenuTabs from '../components/MenuTabs.vue'
import { inspectionTabs } from '../constants'
import { useInspections } from '../hooks/useInspections'

const activeTab = ref('open')
const counts = { open: 1 }

function onCreate() {
  router.push({ name: 'InspectionCreate' })
}

function onSeeDetail(row: any) {
  router.push({ name: 'InspectionDetail', params: { id: row.id } })
}

const params = computed(() => ({
  status: activeTab.value
}))

const { data, isLoading } = useInspections(params)
</script>

<template>
  <Header
    title="Inspection Record"
    :crumbs="[{ label: 'Inspection', to: '#' }, { label: 'Inspection Record' }]"
  />

  <div class="bg-white p-4">
    <div class="flex justify-between w-full border-b border-b-gray-300 mb-2">
      <MenuTabs
        :counts
        :tabs="inspectionTabs"
        :activeTab="activeTab"
        @update:activeTab="(val) => (activeTab = val)"
      />
      <MenuActions />
    </div>

    <div class="flex items-center justify-end gap-3 mb-2">
      <Button @click="onCreate" size="lg">
        <template #left><Plus class="h-4 w-4" /></template>Create Request
      </Button>
    </div>

    <div class="bg-white shadow-sm p-4">
      <template v-if="isLoading">
        <InspectionsTableSkeleton />
      </template>

      <template v-if="!isLoading">
        <InspectionsTable :data="data?.data ?? []" @create="onCreate" @see-detail="onSeeDetail" />
        <div class="px-4 py-3 text-sm text-gray-500">
          {{ data?.data?.length }} Entries Displayed
        </div>
      </template>
    </div>
  </div>
</template>
