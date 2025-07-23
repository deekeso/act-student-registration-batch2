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
import type { Product } from '@/types/Product';
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface SearchResult {
  value: string;
  product: Product;
}

const searchText = ref('');
const router = useRouter();

function querySearch(queryString: string, cb: (results: SearchResult[]) => void) {
  const results = products
    .filter(product =>
      (product.name || '').toLowerCase().includes(queryString.toLowerCase())
    )
    .map(product => ({
      value: product.name || '',
      product, // pass the whole product for selection
    }));
  cb(results);
}

function handleSelect(item: { value: string; product: Product }) {
  router.push({
    path: `/product/${item.product.id}`,
  });
  searchText.value = item.value;
}
</script>

<style scoped>
:deep(.el-autocomplete) {
  /* width: 50%; */
}
</style>
