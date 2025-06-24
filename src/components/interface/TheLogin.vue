<template>
  <div v-loading="loading" class="login-container">
    <div id="user" class="login_fields">
      <el-input v-model="authStore.username" placeholder="USERNAME" :prefix-icon="User" />
      <el-input
        v-model="authStore.password"
        placeholder="PASSWORD"
        type="password"
        :prefix-icon="Lock"
      />
      <el-button type="primary" @click="handleLogin" :disabled="!authStore.isFormValid">
        LOGIN
      </el-button>
      <div>
        <a href="#" class="forgot-password" @click="handleForgotPassword"> Forgot password? </a>
        <el-dialog
          v-model="showForgotDialog"
          title="Forgot Password"
          width="400px"
          :close-on-click-modal="false"
          style="border-radius: 10px"
        >
          <ForgotPass />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ForgotPass from '@/components/ui/message box/ForgotPass.vue'

// Use the Pinia auth store
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const showForgotDialog = ref(false)

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
    ElMessage.error(result.message)
  }
}

const handleForgotPassword = (event: Event) => {
  event.preventDefault() // Prevents page reload
  showForgotDialog.value = true
}
</script>

<style scoped>
.el-input {
  align-items: center;
  color: #fff;
}
:deep(.el-input__inner::placeholder) {
  color: #fff;
  font-size: 14px;
  font-weight: lighter;
}
:deep(.el-input__inner) {
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: lighter;
}
:deep(.el-input__wrapper) {
  margin: 0 0 10px 0;
  background-color: transparent;
  width: 200px;
  height: 45px;
}
:deep(.el-icon) {
  color: #fff;
  width: 20px;
  height: 20px;
}
:deep(.el-button) {
  margin: 20px 0 10px 0;
}
:deep(.el-button.el-button--primary) {
  background: #fff;
  width: 100%;
  height: 45px;
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
  font-size: 16px;
  font-weight: medium;
  color: #fff;
  align-self: flex-end !important;
  display: flex !important;
  justify-content: flex-end !important;
  text-decoration: none;
  &:hover {
    color: #a0cfff;
    text-decoration: underline;
  }
  :deep(.el-dialog) {
  }
}
</style>
