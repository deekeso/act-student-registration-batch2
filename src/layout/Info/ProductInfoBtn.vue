<template>
  <div class="add-buy-btn">
    <el-button @click="handleAddToCart" class="add-btn" round >Add to Cart</el-button>
    <el-button @click="handleBuyNow" class="buy-btn" round>Buy Now</el-button>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { useAuthStore } from '@/stores/userAuth'
import type { Product } from '@/types/Product'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const props = defineProps<{
  product: Product
  quantity: number
}>()

const emit = defineEmits(['open-dialog'])
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const checkoutStore = useCheckoutStore()

function handleAddToCart() {
  if (authStore.isLoggedIn) {
    cartStore.addToCart(props.product, props.quantity)
    ElMessage.success('Item added to cart successfully!')
  } else {
    emit('open-dialog')  // properly emits to parent
    console.log('User not logged in, opening login dialog.');
  }
}

function handleBuyNow() {
  if (authStore.isLoggedIn) {
    checkoutStore.addItemToCheckout(props.product, props.quantity)
    router.push('/product/checkout')
  } else {
    emit('open-dialog')
  }
}
</script>

<style scoped>
/* .add-buy-btn {
  margin-top: auto;
} */
</style>
