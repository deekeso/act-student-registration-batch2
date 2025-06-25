<template>
  <div class="login-container">
    <div id="user" class="login_fields">
      <el-input v-model="authStore.username" placeholder="USERNAME" :prefix-icon="User" />
      <el-input
        v-model="authStore.password"
        placeholder="PASSWORD"
        type="password"
        :prefix-icon="Lock"
      />
      <el-button color="white" @click="handleLogin" :disabled="!isFormValid"> LOGIN </el-button>
      <div>
        <a href="#" class="forgot-password" @click="handleForgotPassword"> Forgot password? </a>
        <el-dialog
          v-model="showForgotDialog"
          title="Forgot Password"
          width="400px"
          :close-on-click-modal="false"
          style="
            border-radius: 10px;
            border-top: 4px solid #fff;
            background-color: rgba(46, 86, 210);
            padding: 40px 25px 20px 25px;
          "
        >
          <p style="color: #fff">Enter your username and new password to reset your password.</p>
          <ForgotPass @close="showForgotDialog = false" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import ForgotPass from '@/components/ui/message box/ForgotPass.vue'

// Use the Pinia auth store
const authStore = useAuthStore()
const router = useRouter()
const showForgotDialog = ref(false)

// Debug: Check if form is valid
const isFormValid = computed(() => {
  const valid = authStore.username.trim() && authStore.password.trim()
  console.log('Form validation:', {
    username: authStore.username,
    password: authStore.password,
    isValid: valid,
  })
  return valid
})

// Watch for changes in form fields
watch([() => authStore.username, () => authStore.password], () => {
  console.log('Form fields changed:', {
    username: authStore.username,
    password: authStore.password,
    isValid: isFormValid.value,
  })
})

// Handle login action
const handleLogin = async () => {
  const result = authStore.validateCredentials() // Not async in store

  if (result.success) {
    authStore.saveCredentials() // Save to localStorage
    console.log(result.message, { username: authStore.username })

    // Full screen loading
    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'Logging in...',
      background: 'rgba(255, 255, 255, 0.95)',
      customClass: 'custom-loading',
    })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await router.push('/dashboard')
      console.log('Navigating to /dashboard')
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      loadingInstance.close()
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
  width: 100%;
  height: 45px !important;
  border-radius: 4px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.15);
}
:deep(.el-button.el-button--primary) {
  background: #fff;
  width: 100%;
  height: 45px;
}
:deep(.el-button > span) {
  font-weight: 500;
  color: #2148c0;
}
:deep(.el-button.el-button--primary.is-disabled) {
  cursor: not-allowed;
}

/* Custom Loading Styles */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(2px);
}

:deep(.el-loading-spinner) {
  color: #2148c0 !important;
}

:deep(.el-loading-spinner .el-loading-text) {
  color: #2148c0 !important;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
}

:deep(.el-loading-spinner .path) {
  stroke: #2148c0 !important;
}

/* Full Screen Loading Styles */
:deep(.custom-loading .el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(2px);
}

:deep(.custom-loading .el-loading-spinner) {
  color: #2148c0 !important;
}

:deep(.custom-loading .el-loading-spinner .el-loading-text) {
  color: #2148c0 !important;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
}

:deep(.custom-loading .el-loading-spinner .path) {
  stroke: #2148c0 !important;
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
  :deep(.el-dialog .el-dialog__title) {
    color: white !important;
    font-size: 18px;
    font-weight: 600;
  }
}
:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #ffffff;
}
:deep(.el-dialog__title) {
  font-weight: 700 !important;
  font-size: 20px;
  color: #ffffff;
}
:deep(.el-dialog__header) {
  padding-bottom: 12px;
}
:deep(.el-dialog) {
  margin-top: 35vh;
}
</style>
