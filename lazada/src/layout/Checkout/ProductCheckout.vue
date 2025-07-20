<template>
  <MainLayout>
    <div class="parent-checkout">
      <TextStyle variant="section-header" class="checkOutHeader">Checkout</TextStyle>
      <div class="checkout">
        <div class="checkout-container">
          <div class="user-info">
            <div>
              <p>Name:</p>
              <span>
                {{ currentUser.name?.lastname || '' }}
              </span>
            </div>
            <el-icon @click="openDrawer" class="editpen-icon"><EditPen /></el-icon>
          </div>

          <!-- checkout item container -->
          <div class="checkout-content" v-for="item in checkoutItems" :key="item.product.id">
            <img :src="item.product.image" :alt="item.product.name" class="item-image" />
            <div class="item-details">
              <TextStyle variant="card-title">{{ item.product.name }}</TextStyle>
              <div>
                <TextStyle variant="card-price">₱{{ item.product.price }}</TextStyle>
                <TextStyle v-if="item.product.oldPrice" variant="card-old-price">
                  ₱{{ item.product.oldPrice }}
                </TextStyle>
              </div>
              <TextStyle variant="default"> x{{ item.quantity }} item </TextStyle>
              <div class="quantity-wrap">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  @change="updateQuantity(item.product.id, item.quantity)"
                />
              </div>
              <ProductCheckoutBtn type="remove" :product-id="item.product.id" />
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary">
        <TextStyle variant="section-header">Summary</TextStyle>
        <div>
          <div>
            <span>Subtotal:</span>
            <span> ₱ {{ checkoutStore.subTotal }}</span>
          </div>
          <div>
            <span>Shipping Fee:</span>
            <span> ₱40</span>
          </div>
          <div>
            <span>Total:</span>
            <span> ₱ {{ checkoutStore.allTotal }}</span>
          </div>
          <ProductCheckoutBtn type="payment" />
          <ProductCheckoutBtn type="place-order" />
        </div>
      </div>
    </div>
    <InfoDrawer :visible="drawerVisible" @close="drawerVisible = false" />
  </MainLayout>
</template>

<script setup lang="ts">
import TextStyle from '@/components/TextStyle.vue'
import { useCheckoutStore } from '../../stores/checkout'
import { onMounted, computed, ref } from 'vue'
import ProductCheckoutBtn from './ProductCheckoutBtn.vue'
import MainLayout from '../MainLayout.vue'
import { EditPen } from '@element-plus/icons-vue'
import InfoDrawer from '../User/InfoDrawer.vue'
import type { User } from '@/types/user'

const currentUser = computed(() => {
  const currentUsername = localStorage.getItem('currentUser')
  const users = JSON.parse(localStorage.getItem('Users') || '[]')
  return users.find((u: User) => u.username === currentUsername) || {}
})

// checkout actions
const checkoutStore = useCheckoutStore()
const checkoutItems = computed(() => checkoutStore.checkoutItems)

function updateQuantity(productId: number, quantity: number) {
  checkoutStore.updateQuantity(productId, quantity)
}

onMounted(() => {
  checkoutStore.loadCheckout()
})

// drawer
const drawerVisible = ref(false)

function openDrawer() {
  drawerVisible.value = true
}
</script>

<style scoped>
.parent-checkout {
  padding: 2rem;
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: center;
}
.checkout {
  display: flex;
  flex-direction: row;
  padding: 2rem;
}

/* header */
.checkOutHeader {
  display: flex;
}
/* personal info */
.editpen-icon {
  cursor: pointer;
}

/* checkout */
/* .checkout-container {
  /* style
} */

/* user */
.user-info {
  background-color: #d9d9d9;
  display: flex;
  margin: 10px 0;
  border-radius: 20px;
  padding: 20px;
}

/* item */
.checkout-content {
  background-color: #d9d9d9;
  display: flex;
  flex-direction: row;
  padding: 20px;
  border-radius: 20px;
  align-items: center;
  margin: 12px;
}
.item-image {
  padding: 2px;
  border-radius: 10px;
  height: 150px;
  /* box-shadow:; */
}

.item-details {
  padding: 6px;
  display: flex;
  flex-direction: column;
  margin: 5px;
  gap: 2px;
}

:deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #cecece;
  box-shadow: none;
}
.el-input-number {
  width: 120px;
}

:deep(.el-input-number__decrease) {
  border-radius: 20px;
}

:deep(.el-input-number__increase) {
  border-radius: 20px;
}

.quantity-wrap {
  margin: 5px 0;
}

/* item summary */
.summary {
  background-color: #d9d9d9;
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
  max-width: fit-content;
}
</style>
