import { createRouter, createWebHistory } from 'vue-router'
// Import pages
import LoginPage from '@/views/LoginPage.vue'
import DashBoard from '@/views/DashBoard.vue'
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue'
import NotFound from '@/views/NotFound.vue'

// Create and configure router instance
const router = createRouter({
  // Use HTML5 history mode (no # in URLs)
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define application routes
  routes: [
    { path: '/', name: 'index', component: LoginPage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/dashboard', name: 'dashboard', component: DashBoard },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordPage },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // Catch-all route for undefined paths (404 handler)
  ],
})

export default router
