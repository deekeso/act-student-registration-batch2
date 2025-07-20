import type { CartItem } from '@/types/CartItem'
import type { Product } from '@/types/Product'
import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[],
  }),
  actions: {
    addToCart(product: Product, quantity: number = 1) {
      const existing = this.cartItems.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.cartItems.push({
          product,
          quantity,
        })
      }
      this._syncCartToUser()
    },
    loadFromCartUser() {
      const currentUsername = localStorage.getItem('currentUser')
      if (currentUsername) {
        const users = JSON.parse(localStorage.getItem('Users') || '[]')
        const user = users.find((u: User) => u.username === currentUsername)
        if (user && user.userCart) {
          this.cartItems = user.userCart
        } else {
          this.cartItems = []
        }
      }
    },
    clearCartOnLogout() {
      this.cartItems = []
    },
    removeFromCart(productId: number) {
      this.cartItems = this.cartItems.filter((item) => item.product.id !== productId)
      this._syncCartToUser()
    },
    clearCart() {
      this.cartItems = []
      this._syncCartToUser()
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.cartItems.find((item) => item.product.id === productId)
      if (item) item.quantity = quantity
      this._syncCartToUser()
    },
    _syncCartToUser() {
      const currentUsername = localStorage.getItem('currentUser')
      if (currentUsername) {
        const users = JSON.parse(localStorage.getItem('Users') || '[]')
        const userIndex = users.findIndex((u: User) => u.username === currentUsername)
        if (userIndex !== -1) {
          users[userIndex].userCart = this.cartItems
          localStorage.setItem('Users', JSON.stringify(users))
        }
      }
    },
  },
  getters: {
    cartCount: (state) => state.cartItems.length, // Returns the number of items currently in the cart.
    cartTotal: (state) =>
      state.cartItems.reduce((total, item) => total + (item.product.price || 0), 0), // Calculates the total price of all items in the cart by adding up their price values.
  },
  persist: true,
})
