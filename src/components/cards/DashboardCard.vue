<template>
  <el-card @click="handleCardClick" class="clickable-card">
    <img :src="image" style="width: 100%; height: 200px;" />
    <template #footer>
      <div class="card-info">
        <TextStyle variant="card-title">{{ truncateText(name, 20) }}</TextStyle>
        <div class="card-info-price">
          <TextStyle variant="card-price">₱{{ price }}</TextStyle>
          <TextStyle v-if="oldPrice" variant="card-old-price" strike> ₱{{ oldPrice }}</TextStyle>
        </div>
        <div class="addtocart">
          <TextStyle variant="listing-ratings">★ {{ rating }}</TextStyle>
          <el-button link @click.stop="addToCart"><el-icon size="20"><ShoppingCartFull /></el-icon></el-button>
        </div>
      </div>
      <slot name="footer-extra" />
    </template>
    <slot />
  </el-card>
</template>

<script setup lang="ts">
import TextStyle from '@/components/TextStyle.vue'
import { truncateText } from '@/composables/text'
import router from '@/router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/userAuth'
import type { Product } from '@/types/Product'
import { ShoppingCartFull } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  id: number
  image: string
  name: string
  price: number
  oldPrice?: number
  rating: number
  product: Product
}>()

const cartStore = useCartStore()
const authStore = useAuthStore()

function handleCardClick() {
  router.push(`/product/${props.id}`)
}

function addToCart() {
  if (authStore.isLoggedIn) {
    cartStore.addToCart(props.product, 1)
    ElMessage.success('Item added to cart successfully!')
  } else {
    ElMessage.info('Please Login or Sign up')
  }
}
</script>

<style scoped>
.el-card {
  height: 100%;
  background-color: #F5F5F5;
  border: 2px solid #D9D9D9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s ease;
  cursor: pointer;
  max-width: 230px;
}

:deep(.el-card__body) {
  padding: 0;
}

.el-card:hover {
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.12);
  border-color: #2e2e2e;
}

:deep(.el-card__footer) {
  display: flex;
  flex-direction: column;
  align-items: start;
  border-top: none;
  margin-top: auto;
  padding: 8px;
  margin-left: 8px;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.addtocart {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .el-card {
    max-width: 100%;
  }
}
</style>
