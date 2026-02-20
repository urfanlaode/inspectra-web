<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { computed, useAttrs } from 'vue'
import { cn } from '../utils/cn'

export type ChipVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'

const chipVariants = cva('px-2 py-0.5 rounded-full text-xs', {
  variants: {
    variant: {
      default: 'bg-gray-50 hover:bg-gray-50/90 text-gray-900',
      primary: 'bg-primary/10 hover:bg-primary/20 text-primary-800',
      secondary: 'bg-gray-200 hover:bg-gray-200/90 text-gray-500',
      success: 'bg-green-100 hover:bg-green-100/90 text-green-800',
      danger: 'bg-red-100 hover:bg-red-100/90 text-red-800',
      warning: 'bg-yellow-100 hover:bg-yellow-100/90 text-yellow-800',
      info: 'bg-sky-100 hover:bg-sky-100/90 text-sky-800'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

const props = withDefaults(
  defineProps<{
    variant?: ChipVariant
    label?: string
  }>(),
  {
    variant: 'default',
    label: ''
  }
)

const attrs = useAttrs()
const chipClasses = computed(() =>
  cn(
    chipVariants({
      variant: props.variant
    }),
    attrs.class
  )
)
</script>

<template>
  <div :class="chipClasses">
    <span v-if="$slots.default" class="flex items-center justify-center">
      <slot />
    </span>
    <span v-else class="flex items-center justify-center">
      {{ label }}
    </span>
  </div>
</template>
