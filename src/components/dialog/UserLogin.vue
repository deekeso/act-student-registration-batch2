<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Login"
    width="500"
  >
    <el-form label-position="top">
      <el-form-item label="Username" prop="username" :error="usernameError">
        <el-input
          v-model="authStore.username"
          style="width: 100%"
          :prefix-icon="User"
          @keyup.enter="handleLogin"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password" :error="passwordError">
        <el-input
          v-model="authStore.password"
          style="width: 100%"
          type="password"
          :prefix-icon="Lock"
          @keyup.enter="handleLogin"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!authStore.isLoggedIn" link @click="forgotPassword" class="password">
          <el-icon><QuestionFilled /></el-icon>
          <span class="button-text">Forgot Password</span>
        </el-button>
        <el-button @click="handleLogin" round type="primary"> Login </el-button>
      </div>
    </template>
  </el-dialog>
  <UserPassword v-model:visible="forgotPasswordDialogVisible"/>
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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
