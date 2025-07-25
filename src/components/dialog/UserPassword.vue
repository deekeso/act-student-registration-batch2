<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Forgot Password"
    width="400"
  >
    <el-form label-position="top">
  <el-form-item label="Username" :error="usernameError">
    <el-input v-model="username" style="width: 100%" placeholder="Enter your username" />
  </el-form-item>
  <el-form-item label="Email" :error="emailError">
    <el-input v-model="email" style="width: 100%" type="email" placeholder="Enter your email" />
  </el-form-item>
  <el-form-item label="New Password" :error="passwordError">
    <el-input v-model="newPassword" style="width: 100%" type="password" placeholder="Enter new password" show-password />
  </el-form-item>
  <el-form-item label="Confirm Password" :error="confirmPasswordError">
    <el-input v-model="confirmPassword" style="width: 100%" type="password" placeholder="Confirm new password" show-password />
  </el-form-item>
</el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { validateEmailField, validateUsernameField, validatePasswordField, validateConfirmPasswordField } from '@/composables/userValidation'
import { useAuthStore } from '@/stores/userAuth';
import { ElMessage } from 'element-plus';

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'submit'])

const username = ref('')
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const authStore = useAuthStore()

function handleSubmit() {
  const usernameCheck = validateUsernameField(username.value)
  const emailCheck = validateEmailField(email.value)
  const passwordCheck = validatePasswordField(newPassword.value)
  const confirmPasswordCheck = validateConfirmPasswordField(newPassword.value, confirmPassword.value)

  usernameError.value = usernameCheck.valid ? '' : usernameCheck.message
  emailError.value = emailCheck.valid ? '' : emailCheck.message
  passwordError.value = passwordCheck.valid ? '' : passwordCheck.message
  confirmPasswordError.value = confirmPasswordCheck.valid ? '' : confirmPasswordCheck.message

  if (
    usernameCheck.valid &&
    emailCheck.valid &&
    passwordCheck.valid &&
    confirmPasswordCheck.valid
  ) {
    const result = authStore.resetPassword(
      username.value,
      email.value,
      newPassword.value,
      confirmPassword.value
    )
    if (result.success) {
      ElMessage.success(result.message)
      emit('update:visible', false)
      username.value = ''
      email.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      ElMessage.error(result.message)
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
