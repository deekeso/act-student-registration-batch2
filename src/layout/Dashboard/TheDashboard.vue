<template>
  <MainLayout>
    <div class="dashboard-outer">
      <div class="dashboard">
        <div class="banner">
          <TheBanner />
        </div>
        <div class="dashboard-content">
          <div class="header">
            <TextStyle variant="section-header" color="">Just For You</TextStyle>
          </div>
          <div class="dashboard-card">
            <div class="card-grid">
              <DashboardCard
                v-for="product in products.slice(0, visibleCount)"
                :key="product.id"
                :id="product.id"
                :image="product.image || ''"
                :name="product.name || ''"
                :price="product.price ?? 0"
                :oldPrice="product.oldPrice"
                :rating="product.rating ?? 0"
              />
            </div>

            <div v-if="products.length > 15" style="text-align: center; margin-top: 20px;">
              <el-button @click="toggleVisible" >
                {{ visibleCount === 10 ? 'Show More' : 'Show Less' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
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
const visibleCount = ref(10)

const toggleVisible = () => {
  visibleCount.value = visibleCount.value === 10 ? products.value.length : 10
}
</script>

<style scoped>
.dashboard-outer {
  align-items: center;
  justify-content: center;
  display: flex;
}

.dashboard {
    overflow: hidden;


}

.banner {
}

.dashboard-content {
  padding : 0 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  align-items: center;
  justify-content: center;
}

.header {
  margin: 20px 0;
  display: flex;
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.el-button {
  background-color: #1E90FF;
  color: white;
  border-radius: 10px;
  width: 350px;
  height: 50px;
  margin-bottom: 20px;
}

@media  (max-width: 435px) {

  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  
  
}

</style>
