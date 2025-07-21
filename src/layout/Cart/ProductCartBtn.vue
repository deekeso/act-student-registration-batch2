<template>
  <el-button v-if="type === 'continue'" size="small" @click="goHome">Continue Shopping</el-button>
  <el-button v-else-if="type === 'checkout'" size="small" @click="handleCheckout"
    >Checkout</el-button
  >
  <el-icon
    v-else-if="type === 'remove'"
    type="danger"
    size="medium"
    @click="removeFromCart(productId)"
    class="delete-icon"
    ><Delete /></el-icon
  >
  <el-button
    v-else-if="type === 'checkoutSelect'"
    size="large"
    @click="handleCheckoutSelect"
    :disabled="!selectedItems || selectedItems.length === 0"
    >Checkout</el-button
  >
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import type { CartItem } from '@/types/CartItem'
import type { Product } from '@/types/Product'
import { useRouter } from 'vue-router'
import { Delete } from '@element-plus/icons-vue';

const props = defineProps<{
  type: 'continue' | 'checkout' | 'remove' | 'checkoutSelect'
  productId?: number
  product?: Product
  selectedItems?: CartItem[]
}>()

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

function goHome() {
  router.push('/home')
}

function removeFromCart(id?: number) {
  if (id) cartStore.removeFromCart(id)
}

function handleCheckout() {
  if (props.product) {
    const cartItem = cartStore.cartItems.find((item) => item.product.id === props.product!.id)
    const quantity = cartItem ? cartItem.quantity : 1
    checkoutStore.addItemToCheckout(props.product, quantity)
    router.push('/product/checkout')
  }
}

function handleCheckoutSelect() {
  if (props.selectedItems && props.selectedItems.length > 0) {
    checkoutStore.setCheckoutItems(props.selectedItems)
    router.push('/product/checkout')
  }
}
</script>

<style scoped>
.delete-icon {
  font-size: 20px;
  color: red;
  cursor: pointer;
}
</style>
