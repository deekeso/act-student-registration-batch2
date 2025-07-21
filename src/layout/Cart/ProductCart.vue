<template>
  <MainLayout>
    <div class="cart-container">
      <TextStyle variant="section-header">Shopping Cart</TextStyle>

      <el-empty v-if="!cartItems.length" description="No cart items">
        <ProductCartBtn type="continue" />
      </el-empty>

      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        Check All
      </el-checkbox>
      <ul>
        <el-checkbox-group v-model="selectedIds">
          <li v-for="item in cartItems" :key="item.product.id">
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

      <!-- To checkout summary -->
       <div class="to-checkout">
          <TextStyle variant="section-header">Summary</TextStyle>
          <div>
            <span>Items:</span>
            <div v-for="item in selectedItems" :key="item.product.id">
              <span>{{ item.product.name }} x {{ item.quantity }}</span>
              <span>₱ {{ cartStore.cartTotalPerItem(item.product.id) }}</span>
            </div>
            <div>
              <span>Total:</span>
            <span> ₱ {{ selectedItemsTotal }}</span>
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

//cart
const cartStore = useCartStore()
const cartItems = computed(() => cartStore.cartItems)

// checkbox
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
    0
  )
)

function handleCheckAllChange(val: boolean) {
  selectedIds.value = val ? cartItems.value.map((item) => item.product.id) : []
}

// quantity
function updateQuantity(productId: number, quantity: number) {
  cartStore.updateQuantity(productId, quantity)
}
</script>

<style scoped>
.cart-container {
  width: 80vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.to-checkout {
  background-color: #d9d9d9;
  border-radius: 20px;
  margin: 20px;
  padding: 20px;
  max-width: fit-content;
  height: fit-content;
}
</style>
