<template>
  <!-- place order btn -->
  <el-button
    v-if="type === 'place-order'"
    @click="handleOrder"
    :disabled="!checkoutStore.isPaid"
    >Place Order Now</el-button
  >

  <!-- payment method btn circle-->
  <el-radio
   v-else-if="type === 'payment'"
    v-model="selectedPayment"
    label="cod"
    @change="handlePayment"
    border
  >
  Cash on Delivery
  </el-radio>

  <!-- remove btn -->
  <el-icon v-else-if="type === 'remove'" @click="removeFromCheckout(productId!)" class="delete-icon"
    ><Delete
  /></el-icon>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '@/stores/checkout'
import { Delete } from '@element-plus/icons-vue'
import { ElLoading, ElMessage } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.mjs';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps<{
  type: 'place-order' | 'payment' | 'remove'
  productId?: number
}>()

const checkoutStore = useCheckoutStore()
const router = useRouter()

const selectedPayment = ref('')

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
.el-button {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border-radius: 10px;
  height: 50px;
  margin: 10px auto;
  border: 1px solid #2e2e2e;
  width: 100%;
}

.delete-icon {
  font-size: 20px;
  color: red;
  cursor: pointer;
}

.el-radio.is-bordered {
  padding: 30px;
  width: 100%;
  border: 2px solid #f5f5f5;
  border-radius: 10px;
  margin: 10px auto;
}

.el-radio.is-bordered.is-checked {
  border: 2px solid #000;
}

:deep(.el-radio__input.is-checked+.el-radio__label) {
  color: #333;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #797a7e;
  border-color: #797a7e;
}
</style>
