import { ref, nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

export interface PortalPosition {
  top: number
  left: number
  width: number
}

export interface UsePortalOptions {
  enabled?: boolean
  offset?: number
}

export function usePortalRef(
  triggerRef: Ref<HTMLElement | null>,
  isOpenRef: Ref<boolean>,
  options: UsePortalOptions = {}
) {
  const { enabled = true, offset = 4 } = options

  const position = ref<PortalPosition>({
    top: -9999,
    left: -9999,
    width: 0
  })

  let scrollParents: Array<EventTarget> = []
  let resizeObserver: ResizeObserver | null = null

  function resolveNode(el: any): HTMLElement | null {
    if (!el) return null
    if (typeof el === 'object' && ('$el' in el || 'el' in el)) {
      return (el as any).$el ?? (el as any).el ?? null
    }
    return el as HTMLElement
  }

  function isScrollable(el: Element) {
    const style = getComputedStyle(el)
    const overflowY = style.overflowY
    const overflowX = style.overflowX
    return /(auto|scroll|overlay)/.test(overflowY + overflowX)
  }

  function getScrollParents(node: Element | null) {
    const parents: Array<EventTarget> = []
    let el: Element | null = node
    while (el && el.parentElement) {
      if (isScrollable(el.parentElement)) parents.push(el.parentElement)
      el = el.parentElement
    }
    parents.push(window)
    return parents
  }

  function updatePosition() {
    const raw = triggerRef.value as any
    const node = resolveNode(raw)
    if (!node) return
    if (typeof node.getBoundingClientRect !== 'function') return
    const rect = node.getBoundingClientRect()
    position.value = {
      top: rect.bottom + offset, // px
      left: rect.left, // px
      width: rect.width
    }
  }

  async function attachScrollListeners() {
    const raw = triggerRef.value as any
    const node = resolveNode(raw)
    if (!node) return
    scrollParents = getScrollParents(node)
    scrollParents.forEach((sp) => {
      sp.addEventListener('scroll', updatePosition, { passive: true, capture: true })
    })
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        updatePosition()
      })
      resizeObserver.observe(node)
    }
  }

  function detachScrollListeners() {
    if (scrollParents && scrollParents.length) {
      scrollParents.forEach((sp) => {
        try {
          sp.removeEventListener('scroll', updatePosition, {
            capture: true
          } as EventListenerOptions)
        } catch {}
      })
    }
    scrollParents = []
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  watch(
    isOpenRef,
    async (open) => {
      if (!open || !enabled) return
      await nextTick()
      updatePosition()
      attachScrollListeners()
    },
    { immediate: false }
  )

  function onResize() {
    updatePosition()
  }

  watch(
    isOpenRef,
    (open) => {
      if (!enabled) return
      if (open) {
        window.addEventListener('resize', onResize)
      } else {
        window.removeEventListener('resize', onResize)
        detachScrollListeners()
      }
    },
    { immediate: false }
  )

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    detachScrollListeners()
  })

  const getStyle = () =>
    enabled
      ? {
          position: 'fixed' as const,
          top: `${position.value.top}px`,
          left: `${position.value.left}px`,
          minWidth: `${position.value.width}px`,
          zIndex: '9999'
        }
      : undefined

  return {
    position,
    updatePosition,
    getStyle
  }
}
