<template>
  <div class="login-container">
    <el-dialog
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      title="Login"
      width="500px"
      style="border-radius: 10px;  border: 1px solid #2e2e2e; padding: 24px;"
      :show-close="false"
      class="responsive-dialog"
    >
      <el-form label-position="top">
        <el-form-item label="Username" prop="username" :error="usernameError">
          <el-input
            v-model="authStore.username"
            :prefix-icon="User"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item label="Password" prop="password" :error="passwordError">
          <el-input
            v-model="authStore.password"
            type="password"
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
            show-password
          />
        </el-form-item>
        <el-link v-if="!authStore.isLoggedIn" @click="forgotPassword" class="password" :underline="false">
          <el-icon><QuestionFilled /></el-icon>
          <span class="button-text">Forgot Password</span>
        </el-link>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleLogin" style="width: 100%;"> Login </el-button>
        </div>
      </template>
    </el-dialog>
    <UserPassword v-model:visible="forgotPasswordDialogVisible"/>
  </div>
</template>

<script setup lang="ts">
import { validatePasswordField, validateUsernameField } from '@/composables/userValidation'
import { useAuthStore } from '@/stores/userAuth'
import { Lock, QuestionFilled, User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import UserPassword from './UserPassword.vue';

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'login'])

const usernameError = ref('')
const passwordError = ref('')

const authStore = useAuthStore()
const forgotPasswordDialogVisible = ref(false)

function forgotPassword() {
   emit('update:visible', false)
  forgotPasswordDialogVisible.value = true
}

const handleLogin = () => {
  const userNameCheck = validateUsernameField(authStore.username)
  const passwordCheck = validatePasswordField(authStore.password)

  usernameError.value = userNameCheck.valid ? '' : userNameCheck.message
  passwordError.value = passwordCheck.valid ? '' : passwordCheck.message

  if (userNameCheck.valid && passwordCheck.valid) {
    emit('login', { username: authStore.username, password: authStore.password })
  }
}
</script>

<style scoped>
.el-input {
  width: 100%;
  height: 50px;
}

.el-link {
  text-decoration: none;
  color: #2e2e2e;
}

.el-link:hover {
  color: #999999;
}

.password {
  display: flex;
  justify-content: end;
}

.button-text {
  color: #2e2e2e;
}

.button-text:hover {
  color: #999999 ;
}

.el-button {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border-radius: 10px;
  height: 50px;
  margin-bottom: 20px;
  border: 1px solid #2e2e2e;
}

.el-button:hover {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border: 1px solid #2e2e2e;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.2);
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width:80% !important;
  }
}

</style>
