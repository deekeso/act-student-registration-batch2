<template>
  <div class="login-container">
    <el-card class="login-card">
      <!-- Step 1: Enter Username -->
      <el-form
        v-if="currentStep === 1"
        @submit.prevent="checkUsername"
        :model="formData"
        ref="usernameForm"
        :rules="usernameRules"
      >
      <!-- Disabled input when checking username -->
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="USERNAME"
            :disabled="isChecking"
            size="large"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

      <!-- Error message -->
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
          class="mb-4"
        />

      <!-- Continue button -->
        <el-form-item>
          <el-button
            type="primary"
            @click="checkUsername"
            class="login-btn"
            size="large"
            :loading="isChecking"
            :disabled="!formData.username || isChecking"
          >
            CONTINUE
          </el-button>
        </el-form-item>
      </el-form>

      <!-- Step 2: Enter New Password -->
      <el-form
        v-if="currentStep === 2"
        @submit.prevent="handleResetPassword"
        :model="formData"
        ref="passwordForm"
        :rules="passwordRules"
      >

      <!-- New Password -->
        <el-form-item prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            placeholder="NEW PASSWORD"
            type="password"
            show-password
            size="large"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- Confirm password -->
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            placeholder="REPEAT NEW PASSWORD"
            type="password"
            show-password
            size="large"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- Error message -->
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
          class="mb-4"
        />

        <!-- Success message -->
        <el-alert
          v-if="successMessage"
          :title="successMessage"
          type="success"
          show-icon
          :closable="false"
          class="mb-4"
        />

        <!-- Reset Password Button -->
        <el-form-item>
          <el-button
            type="primary"
            @click="handleResetPassword"
            @keyup.enter="handleResetPassword"
            class="login-btn"
            size="large"
            :loading="loading"
            :disabled="!isFormValid"
          >
            RESET PASSWORD
          </el-button>
        </el-form-item>
      </el-form>

      <div class="back-to-login">
        <router-link to="/login">Back to Login</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { User, Lock, Loading } from '@element-plus/icons-vue'
import type { ElForm, FormItemRule } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// Form refs in the template for validation calling
const usernameForm = ref<InstanceType<typeof ElForm> | null>(null)
const passwordForm = ref<InstanceType<typeof ElForm> | null>(null)

// Form state
const formData = reactive({
  username: '',
  newPassword: '',
  confirmPassword: '',
})

const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const loading = ref<boolean>(false)

// Form validation rules
const usernameRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
}

const passwordRules = {
  newPassword: [
    { required: true, message: 'Please enter your new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
        if (value !== formData.newPassword) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// Flow control
const currentStep = ref(1)
const isChecking = ref(false)

const passwordsMatch = computed(() => {
  // True if empty or equal passwords
  return !formData.confirmPassword || formData.newPassword === formData.confirmPassword
})

const isFormValid = computed(() => {
  // True if both fields are filled and passwords match
  return formData.newPassword && formData.confirmPassword && passwordsMatch.value
})

// Step 1: Check if username exists
const checkUsername = async () => {
  // Return if no username entered
  if (!usernameForm.value) return

  await usernameForm.value.validate(async (valid) => {
    // Validates username form and sets checking value to true if valid
    if (valid) {
      errorMessage.value = ''
      isChecking.value = true

      try {
        // Simulate API call with delay because why not, hi Sir !
        setTimeout(() => {
          const userExists = authStore.checkUserExists(formData.username)

          if (userExists) {
            // Move to step 2 if user exists
            currentStep.value = 2
          } else {
            errorMessage.value = 'Username not found'
          }

          // Resets isChecking
          isChecking.value = false
        }, 3000) // 3 second delay :)
      } catch (error: any) {
        // Fallback
        errorMessage.value = 'An error occurred while checking username'
        isChecking.value = false
        console.error('Username check error:', error)
      }
    }
  })
}

// Step 2: Reset password
const handleResetPassword = async () => {
  // Empty fields, return
  if (!passwordForm.value) return

  await passwordForm.value.validate(async (valid) => {
    // Validates password form and sets loading value to true if valid
    if (valid) {
      errorMessage.value = ''
      successMessage.value = ''
      loading.value = true

      try {
        const success = await authStore.resetPassword(formData.username, formData.newPassword)

        if (success) {
          successMessage.value = 'Password reset successfully'

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          errorMessage.value = 'Failed to reset password'
        }
      } catch (error: any) {
        errorMessage.value = 'An error occurred while resetting password'
        console.error('Reset password error:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 800px;
  background-color: transparent;
  border: none;
  box-shadow: none;
}

.login-card :deep(.el-card__body) {
  padding: 2rem;
}

.login-card :deep(.el-input__wrapper) {
  background-color: transparent !important;
}

.login-card :deep(.el-input__inner) {
  color: white !important;
  font-family: 'Montserrat', sans-serif;
}

.login-card :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}
.login-card :deep(.el-input__prefix) {
  color: white !important;
}

.login-card :deep(.el-input__suffix) {
  color: white !important;
}

.login-btn {
  width: 100%;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  background-color: white;
  color: #2148c0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

.back-to-login   {
  text-align: right;
  margin-top: 1rem;
}

.back-to-login a {
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-to-login a:hover {
  color: #409eff;
}
</style>
