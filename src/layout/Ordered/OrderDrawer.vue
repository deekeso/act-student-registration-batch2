<template>
  <el-drawer :model-value="visible" @close="onClose" title="Order Details" size="30%">
    <div>
      <div v-if="order">
        <p>Status:</p>
        <OrderStatus />
        <div v-for="item in order.items" :key="item.product.id" class="drawer-item">
          <img :src="item.product.image" :alt="item.product.name" class="item-image" />
          <div>
            <strong>{{ item.product.name }}</strong>
            <p>{{ item.product.description }}</p>
            <p>₱{{ item.product.price }}</p>
            <p>
              x{{ item.quantity }} item:
              {{ ordersStore.orderTotalPerItem(order, item.product.id) }}
            </p>
          </div>
        </div>
        <p>
          Total {{ ordersStore.orderTotalItem(order) }} item: ₱{{
            ordersStore.orderSubTotal(order)
          }}
        </p>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useOrdersStore } from '@/stores/orders'
import type { Order } from '@/types/order'
import { defineProps, defineEmits } from 'vue'
import OrderStatus from './OrderStatus.vue'

defineProps<{
  order: Order | null
  visible: boolean
}>()

const emit = defineEmits(['close'])
const ordersStore = useOrdersStore()

function onClose() {
  emit('close')
}
</script>

<style scoped>
.drawer-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 10px;
}
</style>
