<template>
  <div class="main">
    <TheDashboard />
  </div>
</template>

<script lang="ts" setup>
import TheDashboard from '@/components/interface/TheDashboard.vue'
</script>

<style scoped>
.main {
  width: 100vw;
  gap: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}
</style>
