<template>
  <div class="forgot-pass-container">
    <!-- <h2>Password Reset</h2> -->
    <el-input v-model="username" placeholder="USERNAME" :prefix-icon="User" />
    <el-input
      v-model="password"
      type="password"
      placeholder="NEW PASSWORD"
      :prefix-icon="Lock"
      show-password
    />
    <el-input
      v-model="confirmPassword"
      type="password"
      placeholder="CONFIRM PASSWORD"
      :prefix-icon="Lock"
      show-password
    />
    <el-button color="#ffff" @click="handleResetPassword"> RESET PASSWORD </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

// Use the Pinia auth store
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

// Define emits
const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleResetPassword = () => {
  if (!username.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    ElMessage.error('Please enter both username and new password')
    return
  }
  if (password.value !== confirmPassword.value) {
    ElMessage.error('Passwords do not match')
    return
  }

  const result = authStore.resetPassword(username.value, password.value)

  if (result.success) {
    ElMessage.success(result.message)
    // Clear the form
    username.value = ''
    password.value = ''
    confirmPassword.value = ''
    // Close the dialog after successful reset
    emit('close')
  } else {
    ElMessage.error(result.message)
  }
}
</script>

<style scoped>
.forgot-pass-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0 0 0;
  text-align: center;
}
.forgot-pass-container h2 {
  margin: 8px 0 12px 0;
  font-size: 20px;
  color: #2148c0;
}
.forgot-pass-container p {
  color: #666;
  font-size: 15px;
}
:deep(.el-button > span) {
  color: #fff !important;
}
:deep(.password-input .el-input__inner) {
  background-color: #fff;
  color: red !important;
}
.el-button {
  border-radius: 10px;
  height: 45px;
  width: 100%;
}
:deep(.el-button > span) {
  font-weight: 500 !important;
  font-size: 14px;
  color: #2148c0 !important;
}
</style>
