import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginForm from '@/components/LoginForm.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import StudentList from '@/components/StudentList.vue'
import NotFound from '@/views/NotFound.vue'
import { initializeAdminCredentials } from '@/components/utils/adminInit'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/login', name: 'login', component: LoginForm },
    { path: '/forgotpassword', name: 'forgetpassword', component: ForgotPassword },
    { path: '/studentList', name: 'studentList', component: StudentList },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: NotFound },
  ],
})

router.beforeEach((to, from, next) => {
  initializeAdminCredentials()
  const publicRoutes = ['login', 'forgetpassword', 'home', 'notfound']
  const routeName = to.name?.toString() || ''

  const token = localStorage.getItem('token')
  const loggedInAdmin = localStorage.getItem('loggedInAdmin')
  const isAuthenticated = !!(token && loggedInAdmin)

  if (!publicRoutes.includes(routeName) && !isAuthenticated) {
    console.log('User not authenticated')
    return next({ name: 'login' })
  }

  if (routeName === 'login' && isAuthenticated) {
    console.log('Already authenticated, redirecting to dashboard')
    return next({ name: 'studentList' })
  }

  next()
})

export default router
