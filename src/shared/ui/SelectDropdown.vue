<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { cva } from 'class-variance-authority'
import { ChevronDown, LoaderCircle } from 'lucide-vue-next'
import { computed, nextTick, ref, toRef, useAttrs, watch } from 'vue'
import { useClickOutside } from '../hooks/useClickOutsideRef'
import { usePortalRef } from '../hooks/usePortalRef'
import { cn } from '../utils/cn'

type Variant = 'default'
type Size = 'sm' | 'md' | 'lg'
type SelectValue = string | number | boolean | Record<string, unknown> | null | undefined

const triggerVariants = cva(
  'inline-flex items-center justify-between gap-2 rounded-sm font-medium focus:outline-none min-h-10 px-2.5 py-1.5',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-200 text-gray-800 px-2.5 py-1'
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400',
        false: 'cursor-pointer'
      }
    },
    defaultVariants: {
      variant: 'default',
      disabled: false
    }
  }
)

const optionVariants = cva('cursor-pointer px-3 py-1 text-sm truncate', {
  variants: {
    active: {
      true: 'bg-primary/10',
      false: ''
    },
    selected: {
      true: 'font-semibold',
      false: ''
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: ''
    }
  }
})

const props = withDefaults(
  defineProps<{
    modelValue?: SelectValue
    options?: { label: string; value: SelectValue; disabled?: boolean }[]
    variant?: Variant
    size?: Size
    disabled?: boolean
    loading?: boolean
    placeholder?: string
    label?: string
    menuClass?: string
  }>(),
  {
    variant: 'default',
    size: 'sm',
    disabled: false,
    loading: false,
    placeholder: 'Select',
    label: ''
  }
)

const modelValue = toRef(props, 'modelValue')
const attrs = useAttrs()
const triggerClasses = computed(() =>
  cn(
    triggerVariants({
      variant: props.variant,
      disabled: props.disabled || props.loading
    }),
    attrs.class
  )
)

const emit = defineEmits(['update:modelValue', 'change'])

function onChange(value: SelectValue) {
  emit('update:modelValue', value)
  emit('change', value)
}

const selectedLabel = computed(() => {
  const found = (props.options || []).find((o) => o.value === modelValue.value)
  return found ? found.label : ''
})

const buttonRef = ref<HTMLElement | null>(null)
const optionsRef = ref<HTMLElement | null>(null)
const optionsMounted = computed(() => !!optionsRef.value)

const { getStyle, updatePosition } = usePortalRef(
  buttonRef,
  computed(() => optionsMounted.value),
  { offset: 6 }
)

function resolveNode(el: any) {
  if (!el) return null
  return (el as any).$el ?? (el as any).el ?? el
}
function handleOutside() {
  const btn = resolveNode(buttonRef.value) as HTMLElement | null
  btn?.blur?.()
}
useClickOutside([buttonRef, optionsRef], () => handleOutside(), optionsMounted)

watch(
  () => optionsRef.value,
  (node) => {
    if (node) {
      nextTick(() => updatePosition())
    }
  }
)
</script>

<template>
  <Listbox :modelValue="modelValue" @update:modelValue="onChange" :disabled="disabled || loading">
    <div class="relative">
      <ListboxButton ref="buttonRef" :class="triggerClasses" :aria-disabled="disabled || loading">
        <span class="flex items-center gap-2 min-w-0 text-sm w-full">
          <slot name="left" />
          <span v-if="loading" class="inline-flex items-center">
            <LoaderCircle
              :class="
                size === 'sm'
                  ? 'w-3 h-3 animate-spin'
                  : size === 'lg'
                    ? 'w-5 h-5 animate-spin'
                    : 'w-4 h-4 animate-spin'
              "
            />
          </span>
          <span class="truncate">
            <slot v-if="$slots.default" />
            <template v-else>
              <span v-if="selectedLabel">{{ selectedLabel }}</span>
              <span v-else-if="label">{{ label }}</span>
              <span v-else class="text-gray-400">{{ placeholder }}</span>
            </template>
          </span>
        </span>

        <slot name="right">
          <ChevronDown class="w-4 h-4 text-gray-500" />
        </slot>
      </ListboxButton>

      <Teleport to="body">
        <ListboxOptions ref="optionsRef" :style="getStyle()" class="py-1">
          <div class="bg-white border border-gray-200 rounded-sm shadow-md max-h-60 overflow-auto">
            <ListboxOption
              v-for="(opt, idx) in options"
              :key="idx"
              :value="opt.value"
              :disabled="opt.disabled"
              v-slot="{ active, selected }"
            >
              <div
                :class="
                  cn(
                    optionVariants({
                      active: !!active,
                      selected: !!selected,
                      disabled: !!opt.disabled
                    }),
                    props.menuClass
                  )
                "
              >
                <span>{{ opt.label }}</span>
              </div>
            </ListboxOption>
          </div>
        </ListboxOptions>
      </Teleport>
    </div>
  </Listbox>
</template>
