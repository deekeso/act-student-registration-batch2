<template>
  <div class="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <p>This is the dashboard page.</p>
  </div>
  <TheDashboard />
</template>

<script lang="ts" setup>
import TheDashboard from '/src/components/TheDashboard.vue'
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
}
</style>
