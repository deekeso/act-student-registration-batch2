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
import { ElLoading, ElMessage } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.mjs';
import { useRouter } from 'vue-router';

defineProps<{
  type: 'place-order' | 'payment' | 'remove'
  productId?: number
}>()

const checkoutStore = useCheckoutStore()
const router = useRouter()

async function handleOrder() {
  console.log('Starting handleOrder')
  const loadingInstance: LoadingInstance = ElLoading.service({
    lock: true,
    text: 'Processing your order...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    await checkoutStore.placeOrder()
    ElMessage.success('Order placed successfully!')
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/product/ordered')
  } catch (error) {
    console.error('Error in handleOrder:', error)
    ElMessage.error('Failed to place order. Please try again.')
  } finally {
    loadingInstance.close()
  }
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
