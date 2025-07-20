<template>
  <MainLayout>
    <div class="dashboard-outer">
      <div class="dashboard">
        <div class="banner">
          <TheBanner />
        </div>
        <div class="header">
          <TextStyle variant="section-header" color="">Just For You</TextStyle>
        </div>
        <div class="dashboard-card">
          <el-row :gutter="0">
            <el-col :span="7" v-for="product in products.slice(0, 6)" :key="product.id">
              <DashboardCard
                :id="product.id!"
                :image="product.image || ''"
                :name="product.name || ''"
                :price="product.price ?? 0"
                :oldPrice="product.oldPrice"
                :rating="product.rating ?? 0"
              />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { products as productsData } from '@/constants'
import TheBanner from '@/layout/Dashboard/TheBanner.vue'
import DashboardCard from '@/components/cards/DashboardCard.vue'
import TextStyle from '@/components/TextStyle.vue'
import MainLayout from '../MainLayout.vue'

const productsStore = useProductsStore()

onMounted(() => {
  // Set initial products if not already set
  if (productsStore.products.length === 0) {
    productsStore.setProducts(productsData)
  }
})

const products = computed(() => productsStore.products)
</script>

<style scoped>
.dashboard-outer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.dashboard {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
}

.banner {
  display: flex;
  align-items: center;
  height: 344px;
}

.header {
  margin: 20px 10px;
}

.dashboard-card {
  margin-top: 0;
  position: static;
  display: flex;
  align-items: flex-start;
}
</style>
