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
      <ProductCartBtn type="checkoutSelect" :selected-items="selectedItems" />
      <ul>
        <el-checkbox-group v-model="selectedIds">
          <li v-for="item in cartItems" :key="item.product.id">
            <div class="cart-content">
              <div class="cart-items">
                <div class="cart-item">
                  <el-checkbox :value="item.product.id" size="large">
                    {{ item.product.name }}
                  </el-checkbox>
                  <h3>{{ item.product.name }}</h3>
                  <img :src="item.product.image" :alt="item.product.name" class="item-image" />
                  <div class="item-details">
                    <p>{{ item.product.description }}</p>
                    <p class="item-price">₱{{ item.product.price }}</p>
                    <p v-if="item.product.oldPrice" class="item-old-price">
                      ₱{{ item.product.oldPrice }}
                    </p>
                    <el-input-number
                      v-model="item.quantity"
                      :min="1"
                      @change="updateQuantity(item.product.id, item.quantity)"
                    />
                  </div>
                  <ProductCartBtn type="remove" :product-id="item.product.id" />
                  <ProductCartBtn type="checkout" :product="item.product" />
                </div>
              </div>
            </div>
          </li>
        </el-checkbox-group>
      </ul>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { computed, ref } from 'vue'
import TextStyle from '@/components/TextStyle.vue'
import ProductCartBtn from '@/layout/Cart/ProductCartBtn.vue'
import MainLayout from '../MainLayout.vue'

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

function handleCheckAllChange(val: boolean) {
  selectedIds.value = val ? cartItems.value.map((item) => item.product.id) : []
}

// quantity
function updateQuantity(productId: number, quantity: number) {
  cartStore.updateQuantity(productId, quantity)
}
</script>

<style scoped></style>
