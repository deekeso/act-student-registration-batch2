<template>
  <el-button color="#2148c0" :icon="Plus" @click="$emit('open')" dark> Add </el-button>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'

defineEmits(['open'])
</script>

<style scoped>
.el-button {
  height: 40px;
  width: 100px;
  border-radius: 10px;
}
</style>
