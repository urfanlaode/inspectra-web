import { env } from '@/app/env'
import { createStore } from 'vuex'

export const store = createStore({
  strict: env.VITE_APP_ENV === 'development',
  modules: {}
})
