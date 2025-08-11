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
        <TextStyle variant="listing-ratings">★ {{ product.rating }}</TextStyle>
      </div>
      <div>
        <TextStyle variant="card-price">₱{{ product.price }}</TextStyle>
        <TextStyle v-if="product.oldPrice" variant="card-old-price">₱{{ product.oldPrice }}</TextStyle>
      </div>
      <div v-if="showQuantity" class="quantity-wrap">
        <el-input-number
          v-model="quantityProxy"
          @change="onQuantityChange"
          @input="handleInput"
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
import { ElMessage } from 'element-plus';

const props = defineProps<{
  product: Product
  quantity?: number
  showQuantity?: boolean
  variant?: 'info' | 'cart' | 'checkout' | 'order'
}>()

const emit = defineEmits(['update:quantity'])

const quantityProxy = ref(props.quantity ?? 1)

// Watch for changes in the quantity prop and update the proxy value
watch(
  () => props.quantity,
  (val) => {
    console.log('props.quantity changed:', val)
    if (val !== undefined && !isNaN(val) && val >= 1 && val <= 100) {
      quantityProxy.value = val
    } else {
      console.log('Invalid quantity received:', val)
      if (val !== undefined && !isNaN(val) && val > 100) {
        console.log('Quantity exceeds maximum limit, resetting to 100.')
        ElMessage.warning('Quantity is reset to 100, due to input is greater than 100.')
        quantityProxy.value = 100
      } else {
        console.log('Invalid quantity, resetting to 1')
        ElMessage.warning('Quantity is reset to 1, due to input is less than 1.')
        quantityProxy.value = 1
      }
      emit('update:quantity', quantityProxy.value)
    }
  }
)

// Handle input validation
function handleInput(value: number | undefined) {
  console.log('handleInput called with:', value)
  if (value === undefined || isNaN(value) || value < 1) {
    console.log('Invalid quantity, quantity must be at least 1.')
    ElMessage.error('Invalid quantity, quantity must be at least 1.')
    quantityProxy.value = 1
    emit('update:quantity', 1)
  } else if (value > 100) {
    console.log('Quantity exceeds maximum limit.')
    ElMessage.error('Quantity exceeds maximum limit of 100.')
    quantityProxy.value = 100
    emit('update:quantity', 100)
  }
}

// Function to handle quantity change
function onQuantityChange(val: number) {
  console.log('onQuantityChange called with:', val)
  emit('update:quantity', val)
}
</script>

<style scoped>
.product-card {
  background-color: #D9D9D9;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.1);
  display: flex;
  flex-direction: row;
  border-radius: 20px;
  align-items: center;
  margin: 12px 0;
  width: 100%;
}

/* Product details */
.item-image {
  border-radius: 10px 0 0 10px;
  height: 150px;
  margin-right: 16px;
  aspect-ratio: 1/1;
}

.large-image {
  height: 250px;
}

.item-details {
  display: flex;
  flex-direction: column;
  width: 100%;
  line-height: 18px;
  padding-right: 10px;
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
  margin-right: 16px;
}

@media  (max-width: 540px) {
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
    border-radius: 10px 10px 0 0;
    width: 100%;
  }
  .item-details {
    line-height: 24px;
    padding: 10px;
  }
  .large-image {
    width: 100% !important;
  }
  .action-buttons {
  display: flex;
  justify-content: start;
  margin: 16px 0;
  }
}

@media (max-width: 425px) {
  .product-card {
    width: 100%;
  }
}
</style>
