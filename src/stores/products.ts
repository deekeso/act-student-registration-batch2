import { defineStore } from 'pinia'
import type { Product } from '../types/Product'
import { products as productsData } from '@/constants'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
  }),
  actions: {
    setProducts(products: Product[]) {
      this.products = products
      localStorage.setItem('products', JSON.stringify(products))
    },
    loadProducts() {
      const stored = localStorage.getItem('products')
      if (stored) {
        this.products = JSON.parse(stored)
      } else {
        this.products = productsData
        localStorage.setItem('products', JSON.stringify(productsData))
      }
    },
  },
  getters: {
    getProductById: (state) => (id: number) => {
      const product = state.products.find((product) => product.id === id)
      console.log(product)
      return product
    },
    filterProducts: (state) => (category: string) => {
      if (!category) return state.products
      return state.products.filter((product) => product.category === category)
    }
  },
})
