<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <!-- Animated background elements -->
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <!-- Header with smooth transition -->
      <div class="auth-header">
        <h2 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
        <p class="auth-subtitle">
          {{ isLogin ? 'Sign in to your workspace' : 'Join us and start creating' }}
        </p>
      </div>

      <!-- Register Form -->
      <el-form
        v-if="!isLogin"
        :model="form"
        :rules="register"
        ref="registerFormRef"
        label-position="top"
        class="auth-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="Email" prop="email" class="form-item">
          <el-input
            v-model="form.email"
            :prefix-icon="Message"
            placeholder="Enter your email"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Username" prop="username" class="form-item">
          <el-input
            v-model="form.username"
            :prefix-icon="UserFilled"
            placeholder="Choose a username"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password" class="form-item">
          <el-input
            v-model="form.password"
            type="password"
            :prefix-icon="Lock"
            show-password
            placeholder="Create a strong password"
            size="large"
          />
        </el-form-item>
        <div class="button-group">
          <el-button type="primary" native-type="submit" size="large" class="primary-btn">
            Create Account
          </el-button>
          <p class="toggle-text">
            Already have an account?
            <span @click="toggleForm" class="toggle-link">Sign in</span>
          </p>
        </div>
      </el-form>

      <!-- Login Form -->
      <el-form
        v-if="isLogin"
        :model="form"
        :rules="login"
        ref="loginFormRef"
        label-position="top"
        class="auth-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Username" prop="username" class="form-item">
          <el-input
            v-model="form.username"
            :prefix-icon="UserFilled"
            placeholder="Enter your username"
            size="large"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password" class="form-item">
          <el-input
            v-model="form.password"
            type="password"
            :prefix-icon="Lock"
            show-password
            placeholder="Enter your password"
            size="large"
          />
        </el-form-item>
        <div class="button-group">
          <el-button type="primary" native-type="submit" size="large" class="primary-btn">
            Sign In
          </el-button>
          <p class="toggle-text">
            Don't have an account?
            <span @click="toggleForm" class="toggle-link">Create one</span>
          </p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Lock, Message, UserFilled } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/authStore'
import { loginRules, registerRules } from '@/utils/formRules'

const registerFormRef = ref<FormInstance>()
const loginFormRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isLogin = ref(route.query.mode !== 'register')

const form = reactive({
  email: '',
  username: '',
  password: '',
})

const register = registerRules
const login = loginRules

const handleRegister = async () => {
  if (!registerFormRef.value) return
  try {
    const valid = await registerFormRef.value.validate()
    if (valid) {
      await userStore.register(form.username, form.password, form.email || undefined)
      ElMessage.success('Registration successful')
      router.push(`/workspace/${userStore.currentUser!.userId}`)
    }
  } catch (error) {
    console.log(error)
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      await userStore.login(form.username, form.password)
      ElMessage.success('Login successful')
      router.push(`/workspace/${userStore.currentUser!.userId}`)
    }
  } catch (error) {
    console.log(error)
  }
}

const toggleForm = () => {
  isLogin.value = !isLogin.value
  form.email = ''
  form.username = ''
  form.password = ''
  registerFormRef.value?.resetFields()
  loginFormRef.value?.resetFields()
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.auth-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.auth-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s ease-out;
  transition: all 0.3s ease;
}

.auth-container:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.2),
    0 12px 40px rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 60px;
  height: 60px;
  background: var(--primary);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 40px;
  height: 40px;
  background: var(--secondary);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: var(--tertiary);
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--quaternary);
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  color: #666;
  font-size: 0.95rem;
  font-weight: 400;
}

.auth-form {
  animation: fadeIn 0.4s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-item {
  margin-bottom: 24px;
}

/* Enhanced Element Plus input styling */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--quaternary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 2px solid #e8ecf3;
  box-shadow: none;
  transition: all 0.3s ease;
  background: rgba(248, 250, 252, 0.8);
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--primary);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(94, 135, 245, 0.1);
}

:deep(.el-input__inner) {
  font-weight: 400;
  padding: 0 16px;
  height: 48px;
  color: var(--text-color);
}

:deep(.el-input__inner::placeholder) {
  color: #a0a8b8;
  font-weight: 400;
}

:deep(.el-input__prefix-inner) {
  color: var(--primary);
}

.button-group {
  margin-top: 32px;
  text-align: center;
}

.primary-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(94, 135, 245, 0.3);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(94, 135, 245, 0.4);
  background: linear-gradient(135deg, var(--secondary) 0%, var(--tertiary) 100%);
}

.primary-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 16px rgba(94, 135, 245, 0.3);
}

.toggle-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.toggle-link {
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
}

.toggle-link:hover {
  color: var(--secondary);
}

.toggle-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: var(--primary);
  transition: width 0.3s ease;
}

.toggle-link:hover::after {
  width: 100%;
}

/* Form validation styling */
:deep(.el-form-item.is-error .el-input__wrapper) {
  border-color: #f56c6c;
  box-shadow: 0 0 0 4px rgba(245, 108, 108, 0.1);
}

:deep(.el-form-item__error) {
  color: #f56c6c;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 8px 0 0 8px;
  position: relative;
  overflow: visible;
}

/* Success state */
:deep(.el-form-item.is-success .el-input__wrapper) {
  border-color: #67c23a;
  box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .auth-wrapper {
    padding: 16px;
  }

  .auth-container {
    padding: 32px 24px;
    border-radius: 16px;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .form-item {
    margin-bottom: 20px;
  }

  .shape {
    display: none; /* Hide floating shapes on mobile for cleaner look */
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .auth-wrapper {
    background: linear-gradient(135deg, #2d2c5e 0%, #1d0e2c 100%);
  }

  .auth-container {
    background: rgba(45, 44, 94, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .auth-title {
    background: linear-gradient(135deg, #8bb5ff, #a8c8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .auth-subtitle {
    color: #a0a8b8;
  }

  :deep(.el-form-item__label) {
    color: #e2e8f0;
  }

  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  :deep(.el-input__inner) {
    color: #e2e8f0;
  }

  .toggle-text {
    color: #a0a8b8;
  }
}

/* Loading state animation */
.primary-btn.is-loading {
  position: relative;
  overflow: hidden;
}

.primary-btn.is-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Enhanced focus states */
:deep(.el-input__wrapper:focus-within) {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(94, 135, 245, 0.15);
}

/* Form transition animations */
.auth-form {
  transition: all 0.4s ease;
}

/* Micro-interactions */
.form-item {
  position: relative;
  overflow: hidden;
}

.form-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transition: left 0.6s ease;
  z-index: 1;
}

.form-item:focus-within::before {
  left: 0;
}
</style>
