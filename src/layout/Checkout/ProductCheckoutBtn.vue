<template>
  <el-button
    v-if="type === 'place-order'"
    size="small"
    @click="handleOrder"
    :disabled="!checkoutStore.isPaid"
    >Place Order Now</el-button
  >
  <el-button v-else-if="type === 'payment'" size="small" @click="handlePayment"
    >Cash on Delivery</el-button
  >
  <el-icon v-else-if="type === 'remove'" @click="removeFromCheckout(productId!)" class="delete-icon"
    ><Delete
  /></el-icon>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '@/stores/checkout'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps<{
  type: 'place-order' | 'payment' | 'remove'
  productId?: number
}>()

const checkoutStore = useCheckoutStore()

function handleOrder() {
  checkoutStore.placeOrder()
  ElMessage.success('Order placed successfully!')
}

function handlePayment() {
  checkoutStore.payOrder()
}

function removeFromCheckout(id: number) {
  if (id) checkoutStore.removeFromCheckout(id)
}
</script>

<style scoped>
.delete-icon {
  font-size: 20px;
  color: red;
  cursor: pointer;
}
</style>
