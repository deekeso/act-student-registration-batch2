import { useUserStore } from '@/store/authStore'
import AuthView from '@/views/AuthView.vue'
import BoardView from '@/views/BoardView.vue'
import ErrorView from '@/views/ErrorView.vue'
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

    // private
    {
      path: '/workspace/:userId',
      name: 'WorkView',
      component: WorkView,
    },

    // private
    {
      path: '/board/:id',
      name: 'BoardView',
      component: BoardView,
    },

    // page for unknown path
    {
      path: '/:pathMatch(.*)*',
      name: '404View',
      component: ErrorView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  // private routes
  const privateRoutes = ['WorkView', 'BoardView']

  const authStore = useUserStore()

  // default page '404View'
  if (privateRoutes.includes(to.name as string) && !authStore.currentUser) {
    next({ name: '404View' })
  } else {
    next()
  }
})

export default router
