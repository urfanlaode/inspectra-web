import { QueryClient } from '@tanstack/vue-query'
import { VueQueryPlugin } from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

export const query = {
  plugin: VueQueryPlugin,
  options: { queryClient }
}
