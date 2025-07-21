<template>
  <MainLayout>
    <div class="info-container">
      <div v-if="product">
        <ProductCard
          :product="product"
          :quantity="quantity"
          variant="info"
          :show-quantity="true"
          @update:quantity="(q) => quantity = q"
        >
        <template #actions="{ product, quantity }">
          <ProductInfoBtn :product="product" :quantity="quantity" />
        </template>
        </ProductCard>
      </div>
      <div v-else>
        <p>Product not found.</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
import { computed, ref } from 'vue'
import MainLayout from '../MainLayout.vue'
import ProductInfoBtn from './ProductInfoBtn.vue'
import ProductCard from '@/components/cards/ProductCard.vue'

const productsStore = useProductsStore()
const quantity = ref(1)
const props = defineProps<{ id: string | number }>()

const product = computed(() => productsStore.products.find((p) => p.id === Number(props.id)))
</script>

<style scoped>
.info-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
