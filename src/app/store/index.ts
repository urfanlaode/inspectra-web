import { env } from '@/app/env'
import { inspectionModule } from '@/features/inspections/store/inspection.store'
import { createStore } from 'vuex'

export const store = createStore({
  strict: env.VITE_APP_ENV === 'development',
  modules: {
    inspection: inspectionModule
  }
})
