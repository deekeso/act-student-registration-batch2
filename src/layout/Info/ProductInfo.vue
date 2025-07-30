<template>
  <MainLayout>
    <div class="info-outer ">
      <div class="info-inner">
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
            <ProductInfoBtn :product="product" :quantity="quantity"/>
          </template>
          </ProductCard>
        </div>
        <div v-else>
          <el-empty description="Product not found"><el-button @click="handleNoProduct">Back to dashboard</el-button></el-empty>
        </div>
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
  </MainLayout>
</template>

<script setup lang="ts">
import { useProductsStore } from '@/stores/products'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import MainLayout from '../MainLayout.vue'
import ProductInfoBtn from './ProductInfoBtn.vue'
import ProductCard from '@/components/cards/ProductCard.vue'
import DashboardCard from '@/components/cards/DashboardCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const productsStore = useProductsStore()
const quantity = ref(1)
const props = defineProps<{ id: string | number }>()

const product = computed(() => productsStore.products.find((p) => p.id === Number(props.id)))
const products = computed(() => productsStore.products)

onMounted(() =>  {
  productsStore.loadProducts()
})

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


function handleNoProduct() {
  router.push({ path: '/' })
}

</script>

<style scoped>
.info-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin : 0 auto;
  padding: 0 2rem;

}

/* .info-inner {
} */

/* .info-container {
} */

.dashboard-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-button {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border-radius: 10px;
  width: 350px;
  height: 50px;
  margin-bottom: 20px;
  border: 1px solid #2e2e2e;
}

.el-button:hover {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border: 1px solid #2e2e2e;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.5);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

@media  (max-width: 435px) {
  .info-container {
    overflow: hidden;
  }

  .el-button {
    width: 293px;
  }
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

@media (max-width:425px) {
  .el-button {
    width: 300px;
  }

  .info-container {
    width: 300px;
  }
}

</style>
