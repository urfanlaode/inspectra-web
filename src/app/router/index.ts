import InspectionPage from '@/features/inspections/pages/InspectionPage.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/inspections'
  },
  {
    path: '/inspections',
    name: 'Inspection',
    component: InspectionPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((_to, _from, next) => {
  next()
})
