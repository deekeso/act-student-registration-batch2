<template>
  <div class="forgot-pass-container">
    <h2>Password Reset</h2>
    <el-input v-model="username" placeholder="USERNAME" />
    <el-input v-model="password" placeholder="PASSWORD" style />
    <el-button color="#2148c0" :dark="useDark" @click="handleResetPassword"
      >Reset Password</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDark } from '@vueuse/core'

const username = ref('')
const password = ref('')

const handleResetPassword = () => {
  console.log('Reset Password')
}
</script>

<style scoped>
.forgot-pass-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
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
  /* Add any other styles you want */
}
</style>
