<template>
  <el-drawer v-if="isMobile" :model-value="visible" @close="onClose" title="Order Details" size="100%">
    <div>
      <div v-if="order">
        <p>Status:</p>
        <OrderStatus :order="order" @status-change="handleStatusChange" />
        <div v-for="item in order.items" :key="item.product.id" class="drawer-item">
          <img :src="item.product.image" :alt="item.product.name" class="item-image" />
          <div>
            <TextStyle variant="card-title">{{ item.product.name }}</TextStyle>
            <TextStyle variant="card-price">₱{{ item.product.price }}</TextStyle>
            <TextStyle variant="quantity">
              x{{ item.quantity }} item:
              {{ ordersStore.orderTotalPerItem(order, item.product.id) }}
            </TextStyle>
          </div>
        </div>
        <span>
          Total {{ ordersStore.orderTotalItem(order) }} item:
            ₱{{
            ordersStore.orderSubTotal(order)
          }}
        </span>
      </div>
    </div>
  </el-drawer>

    <el-drawer v-else :model-value="visible" @close="onClose" title="Order Details" size="30%">
    <div>
      <div v-if="order">
        <p>Status:</p>
        <OrderStatus :order="order" @status-change="handleStatusChange" />
        <div v-for="item in order.items" :key="item.product.id" class="drawer-item">
          <img :src="item.product.image" :alt="item.product.name" class="item-image" />
          <div>
            <TextStyle variant="card-title">{{ item.product.name }}</TextStyle>
            <TextStyle variant="card-price">₱{{ item.product.price }}</TextStyle>
            <TextStyle variant="quantity">
              x{{ item.quantity }} item:
              {{ ordersStore.orderTotalPerItem(order, item.product.id) }}
            </TextStyle>
          </div>
        </div>
        <span>
          Total {{ ordersStore.orderTotalItem(order) }} item:
            ₱{{
            ordersStore.orderSubTotal(order)
          }}
        </span>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useOrdersStore } from '@/stores/orders'
import type { Order } from '@/types/order'
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue'
import OrderStatus from './OrderStatus.vue'
import TextStyle from '@/components/TextStyle.vue';

defineProps<{
  order: Order | null
  visible: boolean
}>()

const emit = defineEmits(['close', 'status-change'])
const ordersStore = useOrdersStore()

function handleStatusChange(newStatus: 'Pending' | 'Completed') {
  emit('status-change', newStatus)
  // Optionally, call a store action to persist in the parent
}

function onClose() {
  emit('close')
}

const isMobile = ref(window.innerWidth <= 1100)

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 1100
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  updateIsMobile()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
:deep(.el-drawer) {
  background-color: #F5F5F5;
  border-left: 1px solid #D9D9D9;
  box-shadow: -4px 0 12px rgba(46, 46, 46, 0.05);
}

:deep(.el-drawer__header) {
  background-color: #2E2E2E;
  color: #D9D9D9;
  padding: 16px;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 18px;
}

:deep(.el-drawer__body) {
  padding: 24px;
}

.drawer-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 16px;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
  border: 1px solid #D9D9D9;
}

.drawer-item > div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .drawer-item {
    padding: 12px;
  }
  .item-image {
    width: 60px;
    height: 60px;
    margin-right: 12px;
  }
}
</style>
