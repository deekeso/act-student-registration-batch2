<template>
  <div class="login-container">
    <el-card class="login-card">
      <el-form @submit.prevent="handleLogin" :model="formData" ref="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="USERNAME" size="large">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="PASSWORD"
            type="password"
            show-password
            size="large"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
          class="mb-4"
        />

        <el-form-item>
          <el-button
            native-type="submit"
            @click="handleLogin"
            class="login-btn"
            size="large"
            :loading="loading"
          >
            LOGIN
          </el-button>
        </el-form-item>
      </el-form>

      <div class="forgot-password">
        <router-link to="/forgot-password">Forgot Password?</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const loginForm = ref<FormInstance | null>(null)

const formData = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
}

const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!loginForm.value) return

  await loginForm.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      errorMessage.value = ''

      try {
        const success = await authStore.login(formData.username, formData.password)

        if (success) {
          router.push('/')
        } else {
          errorMessage.value = 'Invalid username or password'
        }
      } catch (error) {
        errorMessage.value = 'An error occurred during login'
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-page{
  display: flex;
  justify-content: center;
  align-items: center;
}

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
  margin-top: 1rem;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  background-color: white;
  color: #2148c0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

.forgot-password {
  text-align: right;
  margin-top: 1rem;
}

.forgot-password a {
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.forgot-password a:hover {
  color: #409eff;
}

/* Style for alert messages, margin bottom */
.mb-4 {
  margin-bottom: 1rem;
}
</style>
