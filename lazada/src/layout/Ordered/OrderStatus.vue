<template>
  <el-steps :active="active" finish-status="success">
    <el-step title="Pending" />
    <el-step title="Completed" />
  </el-steps>

  <el-button @click="next">Order Received</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(1)

const next = () => {
  if (active.value++ > 2) active.value = 1
}
</script>

<style scoped></style>
