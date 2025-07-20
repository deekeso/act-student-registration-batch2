import type { Order } from '@/types/order'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
  }),
  actions: {
    addCompletedOrder(order: Order) {
      this.orders.push(order)
    },
  },
  getters: {
    getItemsByOrderId: (state) => (orderId: number) => {
      const order = state.orders.find((order) => order.orderId === orderId)
      if (!order) {
        return
      }
      const orderItems = order.items
      console.log(orderItems)
      return orderItems
    },
    orderTotalPerItem: () => (order: Order, productId: number) => {
      const item = order.items.find((i) => i.product.id === productId)
      return item ? (item.product.price ?? 0) * item.quantity : 0
    },
    orderSubTotal: () => (order: Order) =>
      order.items.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0),
    orderTotalItem: () => (order: Order) =>
      order.items.reduce((total, item) => total + item.quantity, 0),
  },
  persist: true,
})
