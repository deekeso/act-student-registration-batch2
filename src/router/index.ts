import AuthView from '@/views/AuthView.vue'
import BoardView from '@/views/BoardView.vue'
import WorkView from '@/views/WorkView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AuthView',
      component: AuthView,
    },
    {
      path: '/workspace/:userId',
      name: 'WorkView',
      component: WorkView,
    },
    {
      path: '/board/:id',
      name: 'BoardView',
      component: BoardView,
    },
  ],
})

export default router
