<script setup lang="ts">
import { router } from '@/app/router'
import Header from '@/shared/layout/Header.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import InspectionForm from '../components/InspectionForm.vue'
import { useInspection } from '../hooks/useInspection'
import { useStoreInspection } from '../hooks/useStoreInspection'
import type { StoreInspectionPayload } from '../types/inspection.types'

const qc = useQueryClient()

const route = useRoute()
const id = computed(() => route.params.id as string)

const { mutate } = useStoreInspection()

async function onStore(payload: StoreInspectionPayload) {
  mutate(
    { payload, id: +id.value },
    {
      onSuccess() {
        qc.invalidateQueries({ queryKey: ['inspections'], exact: false })
        qc.invalidateQueries({ queryKey: ['inspection', +id.value], exact: true })
        router.replace({ name: 'InspectionDetail', params: { id: +id.value } })
      }
    }
  )
}

const { data, isLoading } = useInspection(+id.value)

const disabledFields = ['serviceTypeId']

const inspection = computed(() => data.value?.data)
</script>

<template>
  <Header
    :title="`Modify Inspection Request - ${inspection?.inspectionNo}`"
    :crumbs="[
      { label: 'Inspection', to: '#' },
      { label: 'Inspection Record', to: '/inspections' },
      { label: 'Modify Request' }
    ]"
  />

  <div class="bg-white shadow-sm p-4">
    <template v-if="isLoading">
      <InspectionsTableSkeleton />
    </template>

    <template v-else>
      <InspectionForm
        @submit="onStore"
        @cancel="$router.back()"
        mode="edit"
        :initialValues="inspection"
        :disabledFields="disabledFields"
      />
    </template>
  </div>
</template>
