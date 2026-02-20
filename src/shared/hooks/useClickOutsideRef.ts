import { onBeforeUnmount, onMounted, type Ref, unref, watch } from 'vue'

type MaybeRef<T> = T | Ref<T>

export function useClickOutside(
  refs: MaybeRef<Ref<HTMLElement | null> | Array<Ref<HTMLElement | null>>>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: MaybeRef<boolean> = true
) {
  function normalize(): Array<Ref<HTMLElement | null>> {
    const r = unref(refs as any)
    return Array.isArray(r) ? r : [r]
  }

  function resolveNode(el: any): HTMLElement | null {
    if (!el) return null

    if (typeof el === 'object' && el !== null && typeof (el as any).nodeType === 'number') {
      return el as HTMLElement
    }

    if (typeof el === 'object') {
      const maybeEl = (el as any).$el ?? (el as any).el ?? null
      if (maybeEl && typeof (maybeEl as any).nodeType === 'number') {
        return maybeEl as HTMLElement
      }
    }

    return null
  }

  function listener(event: MouseEvent | TouchEvent) {
    const rootRefs = normalize()
    const target = event.target as Node | null
    if (!target) return

    for (const r of rootRefs) {
      const value = unref(r)
      const node = resolveNode(value)
      if (!node) continue

      if (typeof (node as any).contains === 'function') {
        if ((node as any).contains(target)) {
          return
        }
      }
    }

    handler(event)
  }

  function attach() {
    if (typeof document === 'undefined') return
    document.addEventListener('mousedown', listener, true)
    document.addEventListener('touchstart', listener, true)
  }

  function detach() {
    if (typeof document === 'undefined') return
    document.removeEventListener('mousedown', listener, true)
    document.removeEventListener('touchstart', listener, true)
  }

  onMounted(() => {
    if (unref(enabled)) attach()
  })

  watch(
    () => unref(enabled),
    (val) => {
      if (val) attach()
      else detach()
    }
  )

  onBeforeUnmount(() => {
    detach()
  })
}
