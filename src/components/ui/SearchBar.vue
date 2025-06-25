<template>
  <div class="search-bar">
    <el-input
      :model-value="props.modelValue"
      @input="(val: string) => emit('update:modelValue', val)"
      placeholder="Search"
      :suffix-icon="Search"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.search-bar {
  width: 60%;
  height: 40px;
  display: flex;
  justify-content: center;
  margin: 0;
}
</style>
