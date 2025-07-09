import { createRouter, createWebHistory } from 'vue-router'
// Import pages
import LoginPage from '@/views/LoginPage.vue'
import DashBoard from '@/views/DashBoard.vue'
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue'
import NotFound from '@/views/NotFound.vue'
import { useAuth } from '@/composables/useAuth'
import { ElMessage } from 'element-plus'
const routes = [
  {
    path: '/',
    component: LoginPage,
    meta: { middleware: 'guest' },
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { middleware: 'guest' },
  },
  {
    path: '/dashboard',
    component: DashBoard,
    meta: { middleware: 'auth' },
  },
  {
    path: '/forgot-password',
    component: ForgotPasswordPage,
    meta: { middleware: 'guest' },
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

// Create and configure router instance
const router = createRouter({
  // Use HTML5 history mode (no # in URLs)
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define application routes
  routes
})


router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  const middleware = to.meta.middleware

  if (!middleware) {
    return next()
  }

  if (middleware === 'auth') {
    if (isAuthenticated()) {
      return next()
    } else {
      ElMessage({ type: 'error', message: 'You need logged in before accessing this page', showClose: true} )
      return next('/')
    }
  }

  if (middleware === 'guest') {
    if (isAuthenticated()) {
      return next('/dashboard')
    } else {
      return next()
    }
  }

  next()
})


export default router
