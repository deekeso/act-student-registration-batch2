<template>
  <MainLayout>
    <div class="orders-container">
      <TextStyle variant="section-header">Orders</TextStyle>

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
            <!-- <p>
              Total {{ ordersStore.orderTotalItem(order) }} item: ₱{{
                ordersStore.orderSubTotal(order)
              }}
            </p> -->
          </div>
        </li>
      </ul>
      <OrderDrawer :order="selectedOrder" :visible="drawerVisible" @close="drawerVisible = false" />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import TextStyle from '@/components/TextStyle.vue'
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
</script>

<style scoped>
.orders-container {
  width: 80vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
