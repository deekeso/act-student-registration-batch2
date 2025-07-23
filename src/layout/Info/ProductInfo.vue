<template>
  <MainLayout>
    <div class="info-outer">
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
          />
        </div>

        <div v-if="products.length > 15" style="text-align: center; margin-top: 20px;">
          <el-button type="primary" @click="toggleVisible">
            {{ visibleCount === 10 ? 'Show More' : 'Show Less' }}
          </el-button>
            </div>
          </div>
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
import DashboardCard from '@/components/cards/DashboardCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const productsStore = useProductsStore()
const quantity = ref(1)
const props = defineProps<{ id: string | number }>()

const product = computed(() => productsStore.products.find((p) => p.id === Number(props.id)))
const products = computed(() => productsStore.products)
const visibleCount = ref(10)

const toggleVisible = () => {
  visibleCount.value = visibleCount.value === 10 ? products.value.length : 10
}

function handleNoProduct() {
  router.push({ path: '/home' })
}

</script>

<style scoped>
.info-outer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin : 0 2rem;
}

.info-inner {
}

.info-container {
  width: 100%;

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
  .info-container {
    overflow: hidden;
    padding : 0 1rem;
  }

  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .dashboard-card{
    overflow: hidden;
  }
  .el-button {
    width: 293px;
  }
}
</style>
