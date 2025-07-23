<template>
  <el-card style="max-width: 230px" @click="handleCardClick" class="clickable-card">
    <img :src="image" style="width: 100%" />
    <template #footer>
      <div class="card-info">
        <TextStyle variant="card-title">{{ truncateText(name, 20) }}</TextStyle>
        <div class="card-info-price">
          <TextStyle variant="card-price">₱{{ price }}</TextStyle>
          <TextStyle v-if="oldPrice" variant="card-old-price" strike> ₱{{ oldPrice }}</TextStyle>
        </div>
        <TextStyle variant="listing-ratings">★ {{ rating }}</TextStyle>
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

const props = defineProps<{
  id: number
  image: string
  name: string
  price: number
  oldPrice?: number
  rating: number
}>()

function handleCardClick() {
  router.push(`/product/${props.id}`)
}
</script>

<style scoped>
.el-card {
  height: 100%;
  background-color: #F5F5F5;
  border: 2px solid #D9D9D9;
  border-radius: 10px;
}
:deep(.el-card__footer) {
  display: flex;
  flex-direction: column;
  align-items: start;
  border-top: none;
  margin-top: auto;
}
.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
