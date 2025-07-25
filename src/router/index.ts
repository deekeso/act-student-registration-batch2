import { createRouter, createWebHistory } from 'vue-router'

import ProductOrdered from '@/layout/Ordered/OrderList.vue'
import HomeView from '@/views/HomeView.vue'
import TheTemplate from '@/components/TheTemplate.vue'
import ProductView from '@/views/ProductView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import UserProfile from '@/layout/Profile/UserProfile.vue'
import { useAuthStore } from '@/stores/userAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/template',
      name: 'template',
      component: TheTemplate,
    },
    {
      path: '/product/:id',
      name: 'ProductInfo',
      component: ProductView,
      props: true,
    },
    {
      // private
      path: '/product/cart',
      name: 'ProductCart',
      component: CartView,
    },
    {
      // private
      path: '/product/checkout',
      name: 'ProductCheckout',
      component: CheckoutView,
    },
    {
      // private
      path: '/product/ordered',
      name: 'ProductOrdered',
      component: ProductOrdered,
    },
    {
      // private
      path: '/profile',
      name: 'UserProfile',
      component: UserProfile,
    }
  ],
})

router.beforeEach((to, from, next) => {

  // private routes
  const privateRoutes = [
    'ProductCart',
    'ProductCheckout',
    'ProductOrdered',
    'UserProfile'
  ]

  const authStore = useAuthStore()

  // default page '/', 'home'
  if (privateRoutes.includes(to.name as string) && !authStore.isLoggedIn) {
    next({ name: 'home'})
  } else {
    next()
  }
})

export default router
