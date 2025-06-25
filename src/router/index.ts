import { createRouter, createWebHistory } from 'vue-router'
import TheLogin from '@/components/interface/TheLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: TheLogin,
      meta: {
        private: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/TheDashboardView.vue'),
      meta: {
        private: true,
      },
    },
  ],
})

export default router
