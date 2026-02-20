<script setup lang="ts">
import { router } from '@/app/router'
import Header from '@/shared/layout/Header.vue'
import InspectionForm from '../components/InspectionForm.vue'
import { useStoreInspection } from '../hooks/useStoreInspection'
import type { StoreInspectionPayload } from '../types/inspection.types'

const { mutate, isPending } = useStoreInspection()

async function onStore(payload: StoreInspectionPayload) {
  mutate(
    { payload },
    {
      onSuccess({ data }) {
        router.replace({ name: 'InspectionDetail', params: { id: data?.id } })
      }
    }
  )
}
</script>

<template>
  <Header
    title="New Inspection Request"
    :crumbs="[
      { label: 'Inspection', to: '#' },
      { label: 'Inspection Record', to: '/inspections' },
      { label: 'New Request' }
    ]"
  />

  <div class="bg-white p-4">
    <InspectionForm
      mode="create"
      @submit="onStore"
      @cancel="$router.back()"
      :submitting="isPending"
    />
  </div>
</template>
