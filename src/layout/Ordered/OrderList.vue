<template>
  <MainLayout>
    <div class="orders-container">
      <div class="orders-content">
      <el-empty v-if="!ordersStore.orders.length" description="No orders">
        <ProductCartBtn type="continue" />
      </el-empty>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" v-else>
        <el-tab-pane label="Pending" name="Pending"></el-tab-pane>
        <el-tab-pane label="Completed" name="Completed"></el-tab-pane>
        <el-tab-pane label="All" name="all"></el-tab-pane>
      </el-tabs>
      <ul>
        <li v-for="order in filteredOrders" :key="order.orderId" @click="openDrawer(order)">
          <div class="orders-content">
            <!-- order-status span color to be Gray if pending, green if complete -->
            <span>Status: <span :class="['order-status',  order.status.toLowerCase()]">{{ order.status }}</span></span>
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
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '../MainLayout.vue'
import { useOrdersStore } from '@/stores/orders'
import { computed, ref } from 'vue'
import OrderDrawer from './OrderDrawer.vue'
import type { Order } from '@/types/order'
import ProductCartBtn from '../Cart/ProductCartBtn.vue'
import ProductCard from '@/components/cards/ProductCard.vue'

const ordersStore = useOrdersStore()
const drawerVisible = ref(false)
const selectedOrder = ref<Order | null>(null)
const activeTab = ref('all')

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

function handleTabClick() {
  // No additional logic needed, as filteredOrders reacts to activeTab
}

// Filter orders based on active tab
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return [...ordersStore.orders].reverse()
  }
  return [...ordersStore.orders]
  .filter(order => order.status === activeTab.value)
  .reverse()
})
</script>

<style scoped>
.orders-content {
  width: 100%;
  max-width: 1200px;
  margin: 16px auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
}

.el-tabs {
  /* margin-bottom: 0px; */
}

::v-deep(.el-tabs__item.is-active) {
  color: #2E2E2E;
  font-weight: 600;
}

::v-deep(.el-tabs__item:hover) {
  color: #555555;
  font-weight: 600;
}

::v-deep(.el-tabs__active-bar) {
  background-color: #2E2E2E;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 74vh;
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
  color: #818181;
  font-weight: 600;
  font-size: 16px;
}

.order-status {
  font-weight: 600;
  font-size: 14px;
  margin-left: 4px;
}

.order-status.pending {
  color: #555555;
  background-color: #d9d9d98e;
  padding: 6px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  border: 1px solid #c4c4c4;
}

.order-status.completed {
  color: #28a745;
  background-color: #caf7d579;
  padding: 6px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  border: 1px solid #66c47c;
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
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>
