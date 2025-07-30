<template>
  <MainLayout>
    <div class="cart-container">
      <div class="checkItems">
        <el-empty v-if="!cartItems.length" description="No cart items">
          <ProductCartBtn type="continue"/>
        </el-empty>
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          v-if="cartItems.length"
        >
          Check All
        </el-checkbox>
        <div class="scrollable-list">
          <ul>
            <el-checkbox-group v-model="selectedIds">
              <li v-for="item in [...cartItems].reverse()" :key="item.product.id">
                <el-checkbox :value="item.product.id" size="large">
                  {{ item.product.name }}
                </el-checkbox>

                <!-- product.name, product.description, product.price, product.oldPrice  -->
                <ProductCard
                  :product="item.product"
                  :quantity="item.quantity"
                  :show-quantity="true"
                  @update:quantity="(q: number) => updateQuantity(item.product.id, q)"
                >
                  <template #actions="{ product }">
                    <ProductCartBtn type="remove" :product-id="product.id" />
                  </template>
                </ProductCard>
              </li>
            </el-checkbox-group>
          </ul>
        </div>
        <ProductCartBtn type="checkoutSelect" :selected-items="selectedItems" v-if="cartItems.length > 3" />
      </div>

      <!-- To checkout summary -->
      <div class="to-checkout" v-if="selectedIds.length > 0 && cartItems.length > 0">
        <TextStyle variant="section-header">Summary</TextStyle>
        <div class="items">
          <span>Items:</span>
          <div class="product-summary-container">
            <div
              v-for="item in [...displayedItems].reverse()"
              :key="item.product.id"
              class="product-summary"
            >
              <div>
                <TextStyle variant="listing-info-description">
                  {{ truncateText(item.product.name!, 15) }}
                </TextStyle>
                <TextStyle variant="quantity"> x{{ item.quantity }}</TextStyle>
              </div>
              <span>₱ {{ cartStore.cartTotalPerItem(item.product.id) }}</span>
            </div>
            <el-button
              v-if="selectedItems.length > defaultItemLimit"
              @click="toggleShowMore"
              class="toggle-button"
              text
              type="info"
            >
              {{ isExpanded ? 'Show Less' : 'Show More' }}
            </el-button>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>₱ {{ selectedItemsTotal }}</span>
          </div>
          <ProductCartBtn type="checkoutSelect" :selected-items="selectedItems" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { computed, ref } from 'vue'
import TextStyle from '@/components/TextStyle.vue'
import ProductCartBtn from '@/layout/Cart/ProductCartBtn.vue'
import MainLayout from '../MainLayout.vue'
import ProductCard from '@/components/cards/ProductCard.vue'
import { truncateText } from '@/composables/text'

// Cart
const cartStore = useCartStore()
const cartItems = computed(() => cartStore.cartItems)

// Checkbox
const selectedIds = ref<number[]>([])
const checkAll = ref(false)
const isIndeterminate = computed(
  () => selectedIds.value.length > 0 && selectedIds.value.length < cartItems.value.length,
)
const selectedItems = computed(() =>
  cartItems.value.filter((item) => selectedIds.value.includes(item.product.id)),
)

const selectedItemsTotal = computed(() =>
  selectedItems.value.reduce(
    (total, item) => total + cartStore.cartTotalPerItem(item.product.id),
    0,
  ),
)

function handleCheckAllChange(val: boolean) {
  selectedIds.value = val ? cartItems.value.map((item) => item.product.id) : []
}

// Quantity
function updateQuantity(productId: number, quantity: number) {
  cartStore.updateQuantity(productId, quantity)
}

// Collapsible summary
const defaultItemLimit = 3 // Number of items to show by default
const isExpanded = ref(false)

const displayedItems = computed(() => {
  if (isExpanded.value || selectedItems.value.length <= defaultItemLimit) {
    return selectedItems.value
  }
  return selectedItems.value.slice(0, defaultItemLimit)
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

.el-checkbox {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  padding: 12px;
  border-radius: 8px;
  margin: 8px 0;
  color: #1A1A1A;
  transition: all 0.3s ease;
}

.el-checkbox:hover {
  background-color: #EDEDED;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.1);
}

.el-checkbox.el-checkbox--large {
  width: 100%;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  padding: 12px;
  border-radius: 8px;
  color: #1A1A1A;
  font-weight: 500;
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

.product-summary-container {
  margin-top: 12px;
}

.product-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.toggle-button {
  margin-top: 8px;
  width: 100%;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #2e2e2e52;
  font-weight: 600;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
    padding: 16px;
  }
  .checkItems {
    padding: 16px;
  }
  .to-checkout {
    margin: 16px 0;
  }
}
</style>
