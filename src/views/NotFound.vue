<template>
  <base-container>
    <h1>404 NOT FOUND</h1>
    <router-link to="/">&laquo; Go back</router-link>
  </base-container>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { BaseContainer } from '@/components';
</script>

<style scoped>
h1 {
  font-size: 10rem;
  margin-bottom: 20px;
  text-align: center;
  color: white;
}

a {
  color: white;
}

.container {
  display: flex !important;
  flex-direction: column !important;
}

@media (max-width: 650px) {
  h1 {
    font-size: 5rem;
  }
}
</style>
