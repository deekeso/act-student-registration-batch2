<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Forgot Password"
    width="400"
    style="border-radius: 10px;  border: 1px solid #2e2e2e; padding: 24px;"
    :show-close="false"
  >
    <el-form label-position="top">
      <el-form-item label="Username" :error="usernameError">
        <el-input v-model="username" style="width: 100%" placeholder="Enter your username" @keyup.enter="handleSubmit" />
      </el-form-item>
      <el-form-item label="Email" :error="emailError">
        <el-input v-model="email" style="width: 100%" type="email" placeholder="Enter your email" @keyup.enter="handleSubmit"/>
      </el-form-item>
      <el-form-item label="New Password" :error="passwordError">
        <el-input v-model="newPassword" style="width: 100%" type="password" placeholder="Enter new password" show-password @keyup.enter="handleSubmit"/>
      </el-form-item>
      <el-form-item label="Confirm Password" :error="confirmPasswordError">
        <el-input v-model="confirmPassword" style="width: 100%" type="password" placeholder="Confirm new password" show-password @keyup.enter="handleSubmit"/>
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
import { ref, watch } from 'vue'
import { validateEmailField, validateUsernameField, validatePasswordField, validateConfirmPasswordField } from '@/composables/userValidation'
import { useAuthStore } from '@/stores/userAuth';
import { ElMessage } from 'element-plus';

const props = defineProps<{ visible: boolean }>()
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

// clear input fields and errors when dialog is closed
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      // Clear input fields
      username.value = ''
      email.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      // Clear errors
      usernameError.value = ''
      emailError.value = ''
      passwordError.value = ''
      confirmPasswordError.value = ''
    }
  }
)
</script>

<style scoped>
:deep(.el-form-item__error) {
  position: relative;
  margin: 2px 0 0 0;
}
.el-input {
  width: 100%;
  height: 50px;
}

.el-button {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #2e2e2e;
}

.el-button:hover {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border: 1px solid #2e2e2e;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.2);
}
</style>
