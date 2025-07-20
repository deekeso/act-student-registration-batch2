<template>
  <div class="add-buy-btn">
    <el-button @click="handleAddToCart">Add to Cart</el-button>
    <el-button @click="handleBuyNow">Buy Now</el-button>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import type { Product } from '@/types/Product'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const props = defineProps<{
  product: Product
  quantity: number
}>()

const cartStore = useCartStore()
const router = useRouter()

const checkoutStore = useCheckoutStore()

function handleAddToCart() {
  cartStore.addToCart(props.product, props.quantity)
  ElMessage.success('Item added to cart successfully!')
}

function handleBuyNow() {
  checkoutStore.addItemToCheckout(props.product, props.quantity)
  router.push('/product/checkout')
}
</script>

<style scoped></style>
