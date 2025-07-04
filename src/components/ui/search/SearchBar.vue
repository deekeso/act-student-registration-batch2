<template>
  <div class="search-bar">
    <el-input
      :model-value="props.modelValue"
      @input="(val: string) => emit('update:modelValue', val)"
      :placeholder="props.placeholder || 'Search by name, and address'"
      :suffix-icon="Search"
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.search-bar {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.search-bar :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 40px;
}

.search-bar :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.search-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(26, 58, 154, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .search-bar {
    width: 90vw;
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .search-bar {
    width: 95vw;
  }
}
</style>
