<template>
  <div v-if="isLoading">
    <el-skeleton animated :rows="4" />
  </div>

  <div v-else-if="userStore.selectedUser">
    <h1>{{ userStore.selectedUser.name }}</h1>
    <p>Email: {{ userStore.selectedUser.email }}</p>
    <p>Username: {{ userStore.selectedUser.username }}</p>
    <p>
      Address: {{ userStore.selectedUser.address.street }},
      {{ userStore.selectedUser.address.city }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const route = useRoute()
const isLoading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)

  try {
    await userStore.fetchUserById(id)

    await new Promise((resolve) => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Failed to fetch user:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped></style>
