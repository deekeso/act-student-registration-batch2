<template>
  <MainLayout>
    <div class="product-filtered-container">
      <div class="filter-tags">
        <TextStyle variant="section-header">{{ currentCategory || 'All Products' }}</TextStyle>
        <FilterTags />
      </div>
      <div v-if="filteredProducts.length > 0" class="product-grid">
        <DashboardCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :id="product.id"
          :image="product.image || ''"
          :name="product.name || ''"
          :price="product.price ?? 0"
          :oldPrice="product.oldPrice"
          :rating="product.rating ?? 0"
        />
      </div>
      <div v-else class="no-products">
        <el-empty description="No products found for category">{{ currentCategory }}</el-empty>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import TextStyle from '@/components/TextStyle.vue';
import MainLayout from '../MainLayout.vue';
import { useProductsStore } from '@/stores/products';
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import DashboardCard from '@/components/cards/DashboardCard.vue';
import FilterTags from '@/components/FilterTags.vue';

const productsStore = useProductsStore()
const route = useRoute()

onMounted(() => {
  productsStore.loadProducts()
})

const currentCategory = computed(() => {
  const category = route.params.category as string
  return category === 'all' ? '' : category
})

const filteredProducts = computed(() => {
  return productsStore.filterProducts(currentCategory.value)
})

</script>

<style scoped>
.product-filtered-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.filter-tags {
  align-items: center;
  margin: 20px auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.no-products {
  text-align: center;
  padding: 32px;
}
</style>
