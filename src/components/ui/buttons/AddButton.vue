<template>
  <el-button type="primary" icon="Plus" @click="$emit('open')">Add</el-button>
</template>

<script lang="ts" setup>
defineEmits(['open'])
</script>
