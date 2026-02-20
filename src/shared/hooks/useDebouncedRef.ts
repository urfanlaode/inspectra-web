import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(source: Ref<T>, ms = 400): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | null = null

  const stop = watch(
    source,
    (val) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = val
        timer = null
      }, ms)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
    stop()
  })

  return debounced
}
