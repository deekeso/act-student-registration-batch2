<template>
    <div :class="['product-card', variant]">
    <img
      :src="product.image"
      :alt="product.name"
      :class="['item-image', { 'large-image': variant === 'info' }]"
    />
    <div class="item-details">
      <div class="product-title">
        <TextStyle variant="card-title">{{ product.name }}</TextStyle>
      </div>
      <div class="product-desc">
        <TextStyle variant="listing-info-description">{{ product.description }}</TextStyle>
      </div>
      <div v-if="variant === 'info'" class="product-rating">
        <TextStyle variant="card-rating">⭐ {{ product.rating }}</TextStyle>
      </div>
      <div>
        <TextStyle variant="card-price">₱{{ product.price }}</TextStyle>
        <TextStyle v-if="product.oldPrice" variant="card-old-price">₱{{ product.oldPrice }}</TextStyle>
      </div>
      <div v-if="showQuantity" class="quantity-wrap">
        <el-input-number
          v-model="quantityProxy"
          :min="1"
          @change="onQuantityChange"
        />
      </div>
      <!-- Slot for custom action buttons (e.g., Add to Cart, Remove, etc.) -->
      <div class="action-buttons">
        <slot name="actions" :product="product" :quantity="quantityProxy" :variant="variant" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '@/types/Product'
import TextStyle from '../TextStyle.vue';

const props = defineProps<{
  product: Product
  quantity?: number
  showQuantity?: boolean
  variant?: 'info' | 'cart' | 'checkout' | 'order'
}>()

const emit = defineEmits(['update:quantity'])

const quantityProxy = ref(props.quantity ?? 1)

watch(
  () => props.quantity,
  (val) => {
    if (val !== undefined) quantityProxy.value = val
  }
)

function onQuantityChange(val: number) {
  emit('update:quantity', val)
}
</script>

<style scoped>
.product-card {
  background-color: #D9D9D9;
  border: 2px solid #f5f5f5;
  display: flex;
  flex-direction: row;
  padding: 20px;
  border-radius: 20px;
  align-items: center;
  margin: 12px 0;
  width: 100%;
}
/* Product details */
.item-image {
  border-radius: 10px;
  height: 150px;
  margin-right: 16px;
}

.large-image {
  height: 250px;
  width: 250px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  line-height: 12px;
}

.item-price {
  font-weight: bold;
  color: #0f146d;
  margin-right: 8px;
}

.item-old-price {
  text-decoration: line-through;
  color: #888;
}

/* el-input-number */
.quantity-wrap {
  margin: 5px 0;
}

:deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #cecece;
  box-shadow: none;
}

.el-input-number {
  width: 120px;
}

:deep(.el-input-number__decrease) {
  border-radius: 20px;
}

:deep(.el-input-number__increase) {
  border-radius: 20px;
}

.quantity-wrap {
  margin: 5px 0;
}

/* action buttons */
.action-buttons {
  display: flex;
  justify-content: end;
}

@media  (max-width: 435px) {
  .product-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    }
  .item-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0  0 12px 0;
  }
  .item-details {
    line-height: 18px;  
  }
}
</style>
