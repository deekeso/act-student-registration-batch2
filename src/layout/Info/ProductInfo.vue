<template>
  <MainLayout>
    <div v-if="product">
      <h2>{{ product.name }}</h2>
      <img :src="product.image" alt="Product image" />
      <p>{{ product.description }}</p>
      <p>Price: ₱{{ product.price }}</p>
      <p v-if="product.oldPrice">Old Price: ₱{{ product.oldPrice }}</p>
      <p>Rating: {{ product.rating }}</p>
      <el-input-number v-model="quantity" :min="1" />
      <ProductInfoBtn :product="product" :quantity="quantity" />
      <!-- Add more details as needed -->
    </div>
    <div v-else>
      <p>Product not found.</p>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
import { computed, ref } from 'vue'
import MainLayout from '../MainLayout.vue'
import ProductInfoBtn from './ProductInfoBtn.vue'

const productsStore = useProductsStore()
const quantity = ref(1)
const props = defineProps<{ id: string | number }>()

const product = computed(() => productsStore.products.find((p) => p.id === Number(props.id)))
</script>

<style scoped></style>
