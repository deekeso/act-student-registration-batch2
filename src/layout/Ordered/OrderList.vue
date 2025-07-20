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
              <div class="order-header"></div>
              <div class="order-items">
                <img :src="item.product.image" :alt="item.product.name" class="item-image" />
                <div class="item-details">
                  <h3>{{ item.product.name }}</h3>
                  <p class="item-price">₱{{ item.product.price }} x{{ item.quantity }}</p>
                </div>
              </div>
            </div>
            <p>
              Total {{ ordersStore.orderTotalItem(order) }} item: ₱{{
                ordersStore.orderSubTotal(order)
              }}
            </p>
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

const ordersStore = useOrdersStore()
const drawerVisible = ref(false)
const selectedOrder = ref<Order | null>(null)

function openDrawer(order: Order) {
  selectedOrder.value = order
  drawerVisible.value = true
}
</script>
