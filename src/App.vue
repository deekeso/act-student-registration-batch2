<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/userAuth'

onMounted(() => {
  const authStore = useAuthStore()
  authStore.loadUserInfo()
})
</script>

<template>
  <router-view />
</template>

<style></style>
