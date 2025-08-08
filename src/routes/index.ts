import ListView from '@/views/ListView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: ListView },
  { path: '/user/:id', component: UserProfileView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
