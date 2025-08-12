import ListView from '@/views/ListView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: ListView },
  { path: '/user/:id', name: 'Profile', component: UserProfileView },
  {
    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: NotFoundView,
    meta: { layout: 'notfound' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
