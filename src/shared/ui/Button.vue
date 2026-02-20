<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { LoaderCircle } from 'lucide-vue-next'

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon'
type Size = 'sm' | 'md' | 'lg'

const buttonVariants = cva(
  'inline-flex items-center rounded-sm justify-center gap-2 font-medium focus:outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-primary/90 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-200/90 text-gray-800',
        ghost: 'bg-transparent hover:bg-gray-50 text-primary',
        icon: 'gap-0 bg-gray-200'
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-sm min-h-10'
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed',
        false: 'cursor-pointer'
      }
    },
    compoundVariants: [
      { variant: 'icon', size: 'sm', class: 'p-1.5 w-6 h-6' },
      { variant: 'icon', size: 'md', class: 'p-2 w-8 h-8' },
      { variant: 'icon', size: 'lg', class: 'p-4 w-10 h-10' }
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      disabled: false
    }
  }
)

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
    label?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    label: ''
  }
)

const attrs = useAttrs()
const buttonClasses = computed(() =>
  cn(
    buttonVariants({
      variant: props.variant,
      size: props.size,
      disabled: props.disabled || props.loading
    }),
    attrs.class
  )
)

const emit = defineEmits(['click'])

function onClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    @click="onClick"
  >
    <span v-if="loading" class="animate-spin inline-flex items-center justify-center">
      <LoaderCircle :class="size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'" />
    </span>

    <slot name="left" />

    <span v-if="$slots.default" class="inline-flex items-center">
      <slot />
    </span>
    <span v-else-if="variant !== 'icon'" class="inline-flex items-center">
      {{ label }}
    </span>

    <slot name="right" />
  </button>
</template>
