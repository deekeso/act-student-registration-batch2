<template>
  <MainLayout>
    <div class="parent-checkout">
      <TextStyle variant="section-header" class="checkOutHeader">Checkout</TextStyle>
      <div class="checkout">
        <div class="checkout-container">
          <div class="user-container">
            <!-- Personal Information -->
            <div class="user-info"
              v-if="
                authStore.userInfo?.name?.lastName &&
                authStore.userInfo?.name?.firstName &&
                authStore.userInfo?.address?.street &&
                authStore.userInfo?.address?.city &&
                authStore.userInfo?.address?.zipCode &&
                authStore.userInfo?.email &&
                authStore.userInfo?.contactNumber
              "
            >
              <div class="user-info-name">
                <p>Name:</p>
                <span>
                {{ authStore.userInfo?.name?.lastName}}, {{ authStore.userInfo?.name?.firstName }} {{ authStore.userInfo?.name?.middleName }}
                </span>
              </div>
              <div class="user-info-address">
                <p>Address:</p>
                <span>{{ authStore.userInfo?.address?.street }}, {{ authStore.userInfo?.address?.barangay }}, {{ authStore.userInfo?.address?.city }}, {{ authStore.userInfo?.address?.zipCode }}, {{ authStore.userInfo?.address?.landmark }} </span>
              </div>
              <div class="user-info-email"><p>Email:</p><span>{{ authStore.userInfo?.email }}</span></div>
              <div class="user-info-contact"><p>Contact Number:</p><span>{{ authStore.userInfo?.contactNumber }}</span></div>
            </div>

            <!-- User Information Form -->
            <div v-else>
              <p>Please fill in your personal information.</p>
            </div>
            <el-icon @click="openDrawer" class="editpen-icon"><EditPen /></el-icon>
          </div>

          <!-- checkout item container -->
          <div class="checkout-content" v-for="item in checkoutItems" :key="item.product.id">
            <ProductCard
              :product="item.product"
              :quantity="item.quantity"
              variant="checkout"
              :show-quantity="true"
              @update:quantity="(q) => updateQuantity(item.product.id, q)"
            >
              <template #actions="{ product }">
                <ProductCheckoutBtn type="remove" :product-id="product.id" />
              </template>
            </ProductCard>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary">
        <TextStyle variant="section-header">Summary</TextStyle>
        <div>
          <div>
            <span>Items:</span>
            <div v-for="item in checkoutItems" :key="item.product.id">
              <span>{{ item.product.name }} x{{ item.quantity }}</span>
              <span>₱ {{ checkoutStore.totalPerItem(item.product.id) }}</span>
            </div>
          </div>
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
          <div v-if="authStore.userInfo?.address">
            <ProductCheckoutBtn type="payment" />
            <ProductCheckoutBtn type="place-order" />
          </div>
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
import { useAuthStore } from '@/stores/userAuth'
import ProductCard from '@/components/cards/ProductCard.vue'

const authStore = useAuthStore()
authStore.loadUserInfo()

// checkout actions
const checkoutStore = useCheckoutStore()
const checkoutItems = computed(() => checkoutStore.checkoutItems)

function updateQuantity(productId: number, quantity: number) {
  checkoutStore.updateQuantity(productId, quantity)
}


onMounted(() => {
  checkoutStore.loadCheckout()
  authStore.loadUserInfo()
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
  color: gray;
  font-size: x-large;
}

/* user */
.user-container {
  background-color: #d9d9d9;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  border-radius: 20px;
  padding: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-info-name,
.user-info-address,
.user-info-email,
.user-info-contact {
  display: flex;
  flex-direction: row;
  gap: 10px;
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
