import { createRouter, createWebHistory } from 'vue-router'
import TheLogin from '@/components/TheLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: TheLogin,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/TheDashboardView.vue'),
    },
    {
      path: '/programs/BSIT',
      name: 'BSIT',
      component: () => import('@/components/InfoTech.vue'),
    },
  ],
})

export default router
