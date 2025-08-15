<template>
  <el-dialog
    v-model="dialogVisible"
    :title="step === 1 ? 'Verify Email' : 'Reset Password'"
    width="400px"
    align-center
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="forgot-password-content">
      <el-text class="description" v-if="step === 1">
        Enter your email address to verify your account.
      </el-text>
      
      <el-text class="description" v-else>
        Please enter your new password.
      </el-text>
      
      <el-form
        ref="forgotPasswordForm"
        :model="form"
        :rules="step === 1 ? emailRules : passwordRules"
        @submit.prevent="handleSubmit"
        class="forgot-form"
        hide-required-asterisk
      >
        <el-form-item v-if="step === 1" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Enter your email address"
            :prefix-icon="Message"
            size="large"
            class="email-input"
            :disabled="loading"
          />
        </el-form-item>

        <template v-else>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="New password"
              :prefix-icon="Lock"
              size="large"
              show-password
              :disabled="loading"
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm new password"
              :prefix-icon="Lock"
              size="large"
              show-password
              :disabled="loading"
            />
          </el-form-item>
        </template>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button 
          @click="step === 1 ? handleClose() : step = 1" 
          :disabled="loading"
          size="large"
        >
          {{ step === 1 ? 'Cancel' : 'Back' }}
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          size="large"
        >
          {{ step === 1 ? 'Verify Email' : 'Reset Password' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

// Props
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': [email: string]
}>()

// Computed
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// State
const loading = ref(false)
const step = ref(1)
const forgotPasswordForm = ref<FormInstance>()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// Validation rules
const emailRules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.password) {
          callback(new Error('Passwords do not match!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// Methods
const handleSubmit = async () => {
  if (!forgotPasswordForm.value) return

  try {
    const valid = await forgotPasswordForm.value.validate()
    if (!valid) return

    loading.value = true

    if (step.value === 1) {
      // Step 1: Verify email
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userExists = users.some((user: any) => user.email === form.email)
      
      if (!userExists) {
        throw new Error('No account found with this email address')
      }
      
      // Move to password reset step
      step.value = 2
    } else {
      // Step 2: Reset password
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex((user: any) => user.email === form.email)
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }
      
      // Update user's password
      users[userIndex].password = form.password
      localStorage.setItem('users', JSON.stringify(users))
      
      // If the user is currently logged in, update the session
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (currentUser && currentUser.email === form.email) {
        currentUser.password = form.password
        localStorage.setItem('user', JSON.stringify(currentUser))
      }
      
      ElMessage.success('Password has been reset successfully!')
      handleClose()
      
      // Redirect to login or home page
      router.push('/login')
    }
  } catch (error) {
    console.error('Password reset error:', error)
    ElMessage.error(error instanceof Error ? error.message : 'An error occurred. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  forgotPasswordForm.value?.resetFields()
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  step.value = 1
  loading.value = false
  dialogVisible.value = false
}

// Simulate API call - replace with your actual implementation
const simulateForgotPasswordAPI = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success/failure
      if (email.includes('test@')) {
        resolve()
      } else {
        reject(new Error('API Error'))
      }
    }, 2000)
  })
}
</script>

<style scoped>
.forgot-password-content {
  padding: 10px 0;
}

.description {
  display: block;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 25px;
  text-align: center;
}

.forgot-form {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.email-input .el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

:deep(.email-input .el-input__wrapper:hover) {
  border-color: #409eff;
}

:deep(.email-input.is-focus .el-input__wrapper) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

:deep(.email-input .el-input__inner) {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-button) {
  min-width: 100px;
}
</style>