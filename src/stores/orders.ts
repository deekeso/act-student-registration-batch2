import type { Order } from '@/types/order'
import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as Order[],
  }),
  actions: {
    addCompletedOrder(order: Order) {
      this.orders.push(order)
      this._syncOrderToUser()
    },
    loadFromUserOrders() {
      const currentUsername = localStorage.getItem('currentUser')
      if (currentUsername) {
        const users = JSON.parse(localStorage.getItem('Users') || '[]')
        const user = users.find((u: User) => u.username === currentUsername)
        if (user && user.userOrders) {
          this.orders = user.userOrders
        } else {
          this.orders = []
        }
      }
    },
    clearOrderOnLogout() {
      this.orders = []
    },
    _syncOrderToUser() {
      const currentUsername = localStorage.getItem('currentUser')
      if (currentUsername) {
        const users = JSON.parse(localStorage.getItem('Users') || '[]')
        const userIndex = users.findIndex((u: User) => u.username === currentUsername)
        if (userIndex !== -1) {
          users[userIndex].userOrders = this.orders
          localStorage.setItem('Users', JSON.stringify(users))
        }
      }
    }
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
    allOrders: () => (order: Order) =>
      order.items.reduce((total, item) => total + (item.product.price ?? 0) * item.quantity, 0) + 40 // fixed shipping fee
  },
  persist: true,
})
