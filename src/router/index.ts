import { createRouter, createWebHistory } from 'vue-router'
import TheLogin from '@/components/interface/TheLogin.vue'

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
  ],
})

router.beforeEach((to, from, next) => {
  // Check if user has an active session
  const hasActiveSession = localStorage.getItem('isLoggedIn') === 'true'

  console.log(
    'Router guard - to:',
    to.path,
    'from:',
    from.path,
    'hasActiveSession:',
    hasActiveSession,
  )

  if (to.path === '/dashboard' && !hasActiveSession) {
    // Redirect to login if trying to access dashboard without being logged in
    console.log('Redirecting to login - no active session')
    next('/')
  } else if (to.path === '/' && hasActiveSession) {
    // Redirect to dashboard if already logged in and trying to access login
    console.log('Redirecting to dashboard - already logged in')
    next('/dashboard')
  } else {
    // Allow navigation
    console.log('Allowing navigation to:', to.path)
    next()
  }
})

export default router
