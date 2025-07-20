<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Login"
    width="500"
    :before-close="handleClose"
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
        <el-button type="primary" @click="handleLogin"> Login </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { validatePasswordField, validateUsernameField } from '@/composables/userValidation'
import { useAuthStore } from '@/stores/userAuth'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

defineProps<{ visible: boolean }>()
defineEmits(['update:visible'])

const usernameError = ref('')
const passwordError = ref('')

// user store actions
const authStore = useAuthStore()

const handleLogin = () => {
  const userNameCheck = validateUsernameField(authStore.username)
  const passwordCheck = validatePasswordField(authStore.password)

  usernameError.value = userNameCheck.valid ? '' : userNameCheck.message
  passwordError.value = passwordCheck.valid ? '' : passwordCheck.message

  if (userNameCheck.valid && passwordCheck.valid) {
    const result = authStore.userLogin(authStore.username, authStore.password)
    if (result.success) {
      ElMessage.success(result.message)
      authStore.username = ''
      authStore.password = ''
      usernameError.value = ''
      passwordError.value = ''
    } else {
      ElMessage.error(result.message)
    }
  }
}

// disabled button

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style scoped></style>
