<template>
  <el-button
    v-if="type === 'place-order'"
    @click="handleOrder"
    :disabled="!checkoutStore.isPaid"
    round
    >Place Order Now</el-button
  >
  <el-button v-else-if="type === 'payment'"  @click="handlePayment" round
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
import { useRouter } from 'vue-router';

defineProps<{
  type: 'place-order' | 'payment' | 'remove'
  productId?: number
}>()

const router = useRouter()
const checkoutStore = useCheckoutStore()

function handleOrder() {
  checkoutStore.placeOrder()
  ElMessage.success('Order placed successfully!')
  router.push('/product/ordered')
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
