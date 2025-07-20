<template>
  <el-autocomplete
    v-model="searchText"
    :fetch-suggestions="querySearch"
    placeholder="Search products..."
    @select="handleSelect"
    clearable
    :prefix-icon="Search"
    style="width: 50%;"
  />
</template>

<script setup lang="ts">
import { products } from '@/constants';
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const searchText = ref('');

function querySearch(queryString: string, cb: (results: any[]) => void) {
  const results = products
    .filter(product =>
      (product.name || '').toLowerCase().includes(queryString.toLowerCase())
    )
    .map(product => ({
      value: product.name,
      product, // pass the whole product for selection
    }));
  cb(results);
}

function handleSelect(item: { value: string; product: any }) {
  // You can do something when a product is selected, e.g., show details or filter
  // For now, just set the searchText to the selected product name
  searchText.value = item.value;
}
</script>

<style scoped>
:deep(.el-autocomplete) {
  width: 40%;
}
</style>
