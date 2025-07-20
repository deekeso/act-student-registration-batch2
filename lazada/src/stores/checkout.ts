import type { Product } from '@/types/Product'
import { defineStore } from 'pinia'
import { useOrdersStore } from './orders'
import type { Order } from '@/types/order'
import { useCartStore } from './cart'
import type { CartItem } from '@/types/CartItem'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    checkoutItems: [] as CartItem[],
    isPaid: false,
  }),
  actions: {
    loadFromCart() {
      const cartStore = useCartStore()
      this.checkoutItems = cartStore.cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }))
    },
    loadCheckout() {
      const stored = localStorage.getItem('checkout')
      if (stored) {
        this.checkoutItems = JSON.parse(stored)
      }
    },
    payOrder() {
      this.isPaid = true
    },
    placeOrder() {
      const ordersStore = useOrdersStore()
      const cartStore = useCartStore()

      if (this.checkoutItems.length > 0) {
        const newOrder: Order = {
          orderId: Date.now(),
          items: [...this.checkoutItems],
          status: 'pending',
          timeline: [{ status: 'Order placed', date: new Date().toISOString() }],
        }

        ordersStore.addCompletedOrder(newOrder)

        this.checkoutItems.forEach((item) => {
          cartStore.removeFromCart(item.product.id)
        })

        this.clearCheckout()
        this.isPaid = false
      }
    },
    clearCheckout() {
      this.checkoutItems = []
      localStorage.removeItem('checkout')
      this.isPaid = false
    },
    addItemToCheckout(product: Product, quantity: number) {
      this.checkoutItems = [
        {
          product: product,
          quantity: quantity,
        },
      ]
      localStorage.setItem('checkout', JSON.stringify(this.checkoutItems))
      this.isPaid = false
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.checkoutItems.find((i) => i.product.id === productId)
      if (item) item.quantity = quantity
      localStorage.setItem('checkout', JSON.stringify(this.checkoutItems))
    },
    setCheckoutItems(items: CartItem[]) {
      this.checkoutItems = items
      localStorage.setItem('checkout', JSON.stringify(this.checkoutItems))
      this.isPaid = false
    },
    removeFromCheckout(productId: number) {
      this.checkoutItems = this.checkoutItems.filter((item) => item.product.id !== productId)
    },
  },

  getters: {
    // total price for all items to checkout
    subTotal: (state) =>
      state.checkoutItems.reduce(
        (total, item) => total + (item.product.price || 0) * item.quantity,
        0,
      ),

    //  total number of items to checkout
    totalItems: (state) => state.checkoutItems.reduce((total, item) => total + item.quantity, 0),

    // total price for all items to checkout + shipping (₱40)
    allTotal: (state) =>
      state.checkoutItems.reduce(
        (total, item) => total + (item.product.price || 0) * item.quantity,
        0,
      ) + 40,

    // total per item
    totalPerItem: (state) => (productId: number) => {
      const item = state.checkoutItems.find((i) => i.product.id === productId)
      return item ? item.product.price || 0 * item.quantity : 0
    },
  },
})
