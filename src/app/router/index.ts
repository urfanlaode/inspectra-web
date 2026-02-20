import InspectionCreatePage from '@/features/inspections/pages/InspectionCreatePage.vue'
import InspectionDetailPage from '@/features/inspections/pages/InspectionDetailPage.vue'
import InspectionEditPage from '@/features/inspections/pages/InspectionEditPage.vue'
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
  },
  {
    path: '/inspections/new',
    name: 'InspectionCreate',
    component: InspectionCreatePage
  },
  {
    path: '/inspections/:id/edit',
    name: 'InspectionEdit',
    component: InspectionEditPage
  },
  {
    path: '/inspections/:id',
    name: 'InspectionDetail',
    component: InspectionDetailPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((_to, _from, next) => {
  next()
})
