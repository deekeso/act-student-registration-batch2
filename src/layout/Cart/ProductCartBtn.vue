<template>
  <el-button v-if="type === 'continue'" size="small" @click="goHome" class="continue-btn">Continue Shopping</el-button>
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
    @click="handleCheckoutSelect"
    :disabled="!selectedItems || selectedItems.length === 0"
    round
    claass="checkout-btn"
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
  router.push('/')
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

/* .checkout-btn {
} */

.el-button, .el-button.is-round {
  width: 100%;
  margin-top: 10px;
}

.continue-btn {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border-radius: 10px;
  width: 350px;
  height: 50px;
  margin-bottom: 20px;
  border: 1px solid #2e2e2e;
}

.continue-btn:hover {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border: 1px solid #2e2e2e;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.5);
}

@media (max-width: 375px) {
  .continue-btn {
    width: 250px;
  }
}

</style>
