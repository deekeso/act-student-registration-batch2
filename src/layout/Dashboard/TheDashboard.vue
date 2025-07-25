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
                :product="product"
              />
            </div>

            <div v-if="products.length > defaultCount" style="text-align: center; margin-top: 20px;">
              <el-button @click="toggleVisible">
                {{ isShowingAll ? 'Show Less' : 'Show More' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount } from 'vue'
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

// Responsive default count
function getVisibleCount() {
  if (window.innerWidth <= 768) return 6
  if (window.innerWidth <= 1024) return 8
  return 10
}
const defaultCount = ref(getVisibleCount())
const visibleCount = ref(getVisibleCount())

// Track if all products are shown
const isShowingAll = computed(() => visibleCount.value === products.value.length)

function updateVisibleCount() {
  const newDefaultCount = getVisibleCount()
  defaultCount.value = newDefaultCount
  // Adjust visibleCount if it's less than the new default or if not showing all
  if (visibleCount.value < newDefaultCount && !isShowingAll.value) {
    visibleCount.value = newDefaultCount
  }
}

onMounted(() => {
  window.addEventListener('resize', updateVisibleCount)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateVisibleCount)
})

const toggleVisible = () => {
  visibleCount.value = isShowingAll.value ? defaultCount.value : products.value.length
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

.dashboard-content {
  padding: 0 2rem;
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

.el-button {
  background-color: #1E90FF;
  color: white;
  border-radius: 10px;
  width: 350px;
  height: 50px;
  margin-bottom: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 435px) {
  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
