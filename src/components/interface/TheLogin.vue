<template>
  <div v-loading="loading" class="login-container">
    <div id="user" class="login_fields">
      <el-input v-model="authStore.username" placeholder="Username" />
      <el-input v-model="authStore.password" placeholder="Password" type="password" />
      <el-button type="primary" @click="handleLogin" :disabled="!authStore.isFormValid">
        Login
      </el-button>
      <div><el-link href="/" class="forgot-password">Forgot password?</el-link></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Use the Pinia auth store
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

// Load saved credentials from localStorage on component mount
onMounted(() => {
  authStore.loadStoredCredentials()
})

// Handle login action
const handleLogin = async () => {
  const result = authStore.validateCredentials() // Not async in store

  if (result.success) {
    authStore.saveCredentials() // Save to localStorage
    console.log(result.message, { username: authStore.username })

    // Loading
    loading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await router.push('/dashboard')
      console.log('Navigating to /dashboard')
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      loading.value = false
    }
  } else {
    console.log(result.message)
  }
}
</script>

<style scoped>
.el-input {
  align-items: center;
}
:deep(.el-input__wrapper) {
  margin: 0 0 10px 0;
  background-color: transparent;
}
:deep(.el-button.el-button--primary) {
  background: #fff;
  width: 100%;
}
:deep(.el-button > span) {
  font-weight: bold;
  color: #2148c0;
}
:deep(.el-button.el-button--primary.is-disabled) {
  background: #a0cfff;
  border-color: #a0cfff;
  opacity: 0.6;
  cursor: not-allowed;
}
.forgot-password {
  color: #fff;
  align-self: flex-end;
}
:deep(.a, .green) {
  color: none;
}
</style>
