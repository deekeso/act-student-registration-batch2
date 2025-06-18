<template>
  <div id="user" class="login_fields">
    <el-input v-model="state.username" placeholder="Username" />
    <el-input v-model="state.password" placeholder="Password" type="password" />
    <el-button type="primary" @click="handleLogin" :disabled="!isFormValid"> Login </el-button>
    <div><el-link href="/" class="forgot-password">Forgot password?</el-link></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoginValidation } from '/src/composables/loginValidation.ts'

// Use the login validation composable
const {
  state,
  isFormValid,
  validateCredentials,
  loadStoredCredentials,
  saveCredentials,
  //hasStoredCredentials,
} = useLoginValidation()

// Load saved credentials from localStorage on component mount
onMounted(() => {
  loadStoredCredentials()
})
// Handle login action
const handleLogin = () => {
  const result = validateCredentials()
  if (result.success) {
    saveCredentials()
    console.log(result.message, { username: state.username })
    // Example: Navigate to dashboard
    // router.push('/dashboard');
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
