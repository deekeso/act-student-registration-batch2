<template>
  <div class="forgot-pass-container">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          placeholder="USERNAME"
          :prefix-icon="User"
          @keyup.enter="handleResetPassword"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="NEW PASSWORD"
          :prefix-icon="Lock"
          :minlength="8"
          show-password
          @keyup.enter="handleResetPassword"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="CONFIRM PASSWORD"
          :prefix-icon="Lock"
          show-password
          @keyup.enter="handleResetPassword"
        />
      </el-form-item>
      <el-button color="#ffff" @click="handleResetPassword"> RESET PASSWORD </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { confirmPasswordValidator, passwordValidator } from '@/composables/formRules'
import type { FormInstance } from 'element-plus'

// Use the Pinia auth store
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const formRef = ref<FormInstance>()

// password validation
const rules = {
  username: [{ required: true, message: 'This field is required', trigger: 'blur' }],
  password: [{ validator: passwordValidator, trigger: 'blur' }],
  confirmPassword: [
    {
      validator: confirmPasswordValidator(() => form.value.password),
      trigger: 'blur',
    },
  ],
}

// Define emits
const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleResetPassword = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    const result = authStore.resetPassword(form.value.username, form.value.password)
    if (result.success) {
      ElMessage.success(result.message)
      // Clear the form
      form.value.username = ''
      form.value.password = ''
      form.value.confirmPassword = ''
      // Close the dialog after successful reset
      emit('close')
    } else {
      ElMessage.error(result.message)
    }
  })
}
</script>

<style scoped>
.forgot-pass-container {
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
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

:deep(.el-form-item__error) {
  padding: 0;
  top: 90%;
}
</style>
