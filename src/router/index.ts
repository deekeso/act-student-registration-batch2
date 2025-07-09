import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'
import ForgetPasswordView from '@/views/ForgetPasswordView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/forgotpassword', name: 'forgetpassword', component: ForgetPasswordView },
    { path: '/studentList', name: 'studentList', component: HomeView },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound },
  ],
})

router.beforeEach((to, from, next) => {
  const guestRoutes = ['login', 'forgetpassword']

  const routeName = to.name?.toString() || ''

  const token = localStorage.getItem('token')
  const loggedInAdmin = localStorage.getItem('loggedInAdmin')

  let isValidAdmin = false
  try {
    if (loggedInAdmin) {
      const parsedAdmin = JSON.parse(loggedInAdmin)
      isValidAdmin = !!(parsedAdmin && parsedAdmin.username && parsedAdmin.loginTime)
    }
  } catch (error) {
    console.error('Invalid admin data:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('loggedInAdmin')
  }

  const isAuthenticated = !!(token && isValidAdmin)

  console.log('Admin route check:', {
    routeName,
    isAuthenticated,
    hasToken: !!token,
    hasValidAdmin: isValidAdmin,
  })

  if (!isAuthenticated) {
    if (guestRoutes.includes(routeName)) {
      return next()
    } else {
      console.log('Non-authenticated user trying to access admin route, redirecting to login')
      return next({ name: 'login' })
    }
  }

  if (isAuthenticated) {
    if (guestRoutes.includes(routeName)) {
      console.log('Authenticated admin trying to access guest route, redirecting to home')
      return next({ name: 'home' })
    } else {
      return next()
    }
  }
})

export default router
