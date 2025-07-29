<template>
  <MainLayout>
    <div class="cart-container">
      <div class="checkItems">
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
              <TextStyle variant="listing-info-description">Name:</TextStyle>
              <TextStyle variant="listing-info-description">
                {{ authStore.userInfo?.name?.lastName }}, {{ authStore.userInfo?.name?.firstName }} {{ authStore.userInfo?.name?.middleName }}
              </TextStyle>
            </div>
            <div class="user-info-address">
              <TextStyle variant="listing-info-description">Address:</TextStyle>
              <TextStyle variant="listing-info-description">
                {{ authStore.userInfo?.address?.street }}, {{ authStore.userInfo?.address?.barangay }}, {{ authStore.userInfo?.address?.city }}, {{ authStore.userInfo?.address?.zipCode }}, {{ authStore.userInfo?.address?.landmark }}
              </TextStyle>
            </div>
            <div class="user-info-email">
              <TextStyle variant="listing-info-description">Email:</TextStyle>
              <TextStyle variant="listing-info-description">{{ authStore.userInfo?.email }}</TextStyle>
            </div>
            <div class="user-info-contact">
              <TextStyle variant="listing-info-description">Contact Number:</TextStyle>
              <TextStyle variant="listing-info-description">{{ authStore.userInfo?.contactNumber }}</TextStyle>
            </div>
          </div>
          <!-- User Information Form -->
          <div v-else>
            <TextStyle variant="listing-info-description">Please fill in your personal information to proceed checkout.</TextStyle>
          </div>
          <el-icon @click="openDrawer" class="editpen-icon"><EditPen /></el-icon>
        </div>

        <!-- Checkout item container -->
        <div class="checkout-content">
          <div class="scrollable-list">
            <ul>
              <li v-for="item in [...checkoutItems].reverse()" :key="item.product.id">
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
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="to-checkout" v-if="checkoutItems.length > 0">
        <TextStyle variant="section-header">Summary</TextStyle>
        <div class="items">
          <div class="items-header">
            <span>Items:</span>
          </div>
          <div class="checkout-items-container">
            <div v-for="item in [...displayedItems].reverse()" :key="item.product.id" class="product-summary">
              <div>
                <TextStyle variant="listing-info-description">{{ truncateText(item.product.name ?? '', 15) }}</TextStyle>
                <TextStyle variant="quantity"> x{{ item.quantity }}</TextStyle>
              </div>
              <span>₱ {{ checkoutStore.totalPerItem(item.product.id) }}</span>
            </div>
            <el-button
              v-if="checkoutItems.length > defaultItemLimit"
              @click="toggleShowMore"
              class="toggle-button"
              text
              type="info"
            >
              {{ isExpanded ? 'Show Less' : 'Show More' }}
            </el-button>
          </div>
          <div class="all">
            <div class="subtotal">
              <span>Subtotal:</span>
              <span>₱ {{ checkoutStore.subTotal }}</span>
            </div>
            <div class="shipping">
              <span>Shipping Fee:</span>
              <span>₱ 40</span>
            </div>
            <div class="total">
              <span>Total:</span>
              <span>₱ {{ checkoutStore.allTotal }}</span>
            </div>
          </div>
          <div
            v-if="
              authStore.userInfo?.name?.lastName &&
              authStore.userInfo?.name?.firstName &&
              authStore.userInfo?.address?.street &&
              authStore.userInfo?.address?.city &&
              authStore.userInfo?.address?.zipCode &&
              authStore.userInfo?.email &&
              authStore.userInfo?.contactNumber
            "
            class="button-group"
          >
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
import { truncateText } from '@/composables/text'

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

// Collapsible summary
const defaultItemLimit = 3 // Number of items to show by default
const isExpanded = ref(false)

const displayedItems = computed(() => {
  if (isExpanded.value || checkoutItems.value.length <= defaultItemLimit) {
    return checkoutItems.value
  }
  return checkoutItems.value.slice(0, defaultItemLimit)
})

function toggleShowMore() {
  isExpanded.value = !isExpanded.value
}

</script>

<style scoped>
.cart-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.checkItems {
  flex: 2;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 24px;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.05);
  height: auto;
  min-height: 60vh;
}

.user-container {
  background-color: #f5f5f5;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-info-name,
.user-info-address,
.user-info-email,
.user-info-contact {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.editpen-icon {
  cursor: pointer;
  color: #1E90FF;
  font-size: 20px;
  transition: color 0.3s ease;
}

.editpen-icon:hover {
  color: #D9D9D9;
}

.scrollable-list {
  max-height: 65vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #D9D9D9 #F5F5F5;
}

.scrollable-list::-webkit-scrollbar {
  width: 8px;
}
.scrollable-list::-webkit-scrollbar-track {
  background: #F5F5F5;
}
.scrollable-list::-webkit-scrollbar-thumb {
  background: #D9D9D9;
  border-radius: 4px;
}
.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #2E2E2E;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

li {
  margin-bottom: 16px;
  overflow-wrap: break-word;
}

.to-checkout {
  flex: 1;
  background-color: #D9D9D9;
  border-radius: 12px;
  margin: 16px 0;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.05);
}

.items {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}

.items-header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.product-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.all {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 16px;
  font-weight: 600;
}

.subtotal,
.shipping,
.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  width: 100%;
}

.total {
  border-top: 1px solid #2E2E2E; /* Solid separator for total */
  padding-top: 12px;
  font-weight: 600;
}

.button-group {
  display: flex;
  margin-top: 16px;
  justify-content: center;
  align-items: center;
}

.toggle-button {
  width: 100%;
}


@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
    padding: 16px;
  }
}
</style>
