<template>
  <div >
    <el-button
    v-for="category in productsCategory"
    :key="category"
    :type="selectedCategory === category ? 'primary' : 'default'"
  >
    <RouterLink :to="`/products/category/${category}`" class="category-link">
      {{ category }}
    </RouterLink>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/products';
import { computed } from 'vue';
import { useRoute } from 'vue-router';


const productsStore = useProductsStore()

const productsCategory = computed(() => {
  const categories = productsStore.products.map(product => product.category)
  return [...new Set(categories)].filter(category => category)
})

const route = useRoute()
const selectedCategory = computed(() => route.params.category as string || '')
</script>

<style scoped>
.el-button {
  background-color: #e2e2e2;
  border: 1px solid #292929;
  padding: 18px;
  margin: 6px;
  border-radius: 10px;
}

.category-link {
  text-decoration: none;
  color: #2e2e2e;
}

.el-button:hover {
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.30);
  background-color: #e2e2e2;
  border: 1px solid #292929;
  transform: translateY(-4px);
}
</style>

