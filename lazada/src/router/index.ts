import { createRouter, createWebHistory } from 'vue-router'

import ProductOrdered from '@/layout/Ordered/OrderList.vue'
import HomeView from '@/views/HomeView.vue'
import TheTemplate from '@/components/TheTemplate.vue'
import ProductView from '@/views/ProductView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
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
      path: '/product/cart',
      name: 'ProductCart',
      component: CartView,
    },
    {
      path: '/product/checkout',
      name: 'ProductCheckout',
      component: CheckoutView,
    },
    {
      path: '/product/ordered',
      name: 'ProductOrdered',
      component: ProductOrdered,
    },
  ],
})

export default router
