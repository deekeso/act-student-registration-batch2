<template>
  <MainLayout>
    <div class="orders-container">
      <el-empty v-if="!ordersStore.orders.length" description="No orders">
        <ProductCartBtn type="continue" />
      </el-empty>

      <ul>
        <li v-for="order in ordersStore.orders" :key="order.orderId" @click="openDrawer(order)">
          <div class="orders-content">
            <span>Status: {{ order.status }}</span>
            <div v-for="item in order.items" :key="item.product.id" class="order-block">
              <ProductCard
                :product="item.product"
                :quantity="item.quantity"
                variant="order"
                :show-quantity="false"
              />
            </div>
          </div>
        </li>
      </ul>
      <OrderDrawer :order="selectedOrder" :visible="drawerVisible" @close="drawerVisible = false" @status-change="onStatusChange" />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../MainLayout.vue'
import { useOrdersStore } from '@/stores/orders'
import { ref } from 'vue'
import OrderDrawer from './OrderDrawer.vue'
import type { Order } from '@/types/order'
import ProductCartBtn from '../Cart/ProductCartBtn.vue'
import ProductCard from '@/components/cards/ProductCard.vue'

const ordersStore = useOrdersStore()
const drawerVisible = ref(false)
const selectedOrder = ref<Order | null>(null)

function openDrawer(order: Order) {
  selectedOrder.value = order
  drawerVisible.value = true
}

function onStatusChange(newStatus: 'Pending' | 'Completed') {
  if (selectedOrder.value) {
    selectedOrder.value.status = newStatus
    ordersStore._syncOrderToUser()
  }
}
</script>

<style scoped>
.orders-container {
  width: 100%;
  max-width: 1200px;
  margin: 36px auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #D9D9D9 #F5F5F5;
}

ul::-webkit-scrollbar {
  width: 8px;
}
ul::-webkit-scrollbar-track {
  background: #F5F5F5;
}
ul::-webkit-scrollbar-thumb {
  background: #D9D9D9;
  border-radius: 4px;
}
ul::-webkit-scrollbar-thumb:hover {
  background: #2E2E2E;
}

li {
  margin-bottom: 16px;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.08);
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

li:hover {
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.12);
}

.orders-content > span {
  color: #1A1A1A;
  font-weight: 600;
  font-size: 16px;
}

.order-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .orders-container {
    padding: 16px;
  }
  li {
    padding: 12px;
  }
}

</style>
