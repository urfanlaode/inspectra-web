<script setup lang="ts">
import Chip, { type ChipVariant } from '@/shared/ui/Chip.vue'
import { toTitle } from '@/shared/utils/to-title'

const STATUS_VARIANT_MAP: Record<string, ChipVariant> = {
  draft: 'secondary',
  ready_for_review: 'warning',
  completed: 'success'
}

const STATUS_LABEL_MAP: Record<string, string> = {
  draft: 'Draft',
  ready_for_review: 'Ready for review',
  completed: 'Completed'
}

function statusVariant(status?: string) {
  if (!status) return 'default'
  return STATUS_VARIANT_MAP[status] ?? 'default'
}

function statusLabel(status?: string) {
  if (!status) return '-'
  return STATUS_LABEL_MAP[status] ?? toTitle(status)
}

const props = withDefaults(
  defineProps<{
    status?: string
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string | null
  }>(),
  { status: '', size: 'md', ariaLabel: null }
)
</script>

<template>
  <Chip
    :variant="statusVariant(props.status)"
    :class="props.size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'"
    :aria-label="props.ariaLabel ?? `Status: ${statusLabel(props.status)}`"
  >
    <span>{{ statusLabel(props.status) }}</span>
  </Chip>
</template>
