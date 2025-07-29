<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Register"
    width="500"
    style="border-radius: 10px;  border: 1px solid #2e2e2e; padding: 24px;"
    :show-close="false"
  >
    <el-form label-position="top" :model="authStore">
      <el-form-item label="Email" prop="email" :error="emailError">
        <el-input
          v-model="form.email"
          :prefix-icon="Message"
          @keyup.enter="handleRegister"
        />
      </el-form-item>
      <el-form-item label="Username" prop="username" :error="usernameError">
        <el-input
          v-model="form.username"
          :prefix-icon="UserFilled"
          @keyup.enter="handleRegister"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password" :error="passwordError">
        <el-input
          v-model="form.password"
          type="password"
          :prefix-icon="Lock"
          @keyup.enter="handleRegister"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleRegister">Register</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  validateEmailField,
  validatePasswordField,
  validateUsernameField,
} from '@/composables/userValidation'
import { useAuthStore } from '@/stores/userAuth'
import type { User } from '@/types/user'
import { Lock, Message, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible',])

// form fields
const form = reactive({
  email: '',
  username: '',
  password: '',
})

// error messages
const emailError = ref('')
const usernameError = ref('')
const passwordError = ref('')

// user store actions
const authStore = useAuthStore()

const handleRegister = () => {
  const emailCheck = validateEmailField(form.email)
  const usernameCheck = validateUsernameField(form.username)
  const passwordCheck = validatePasswordField(form.password)

  console.log(`HANDLE REGISTER ${form.email}`)

  emailError.value = emailCheck.valid ? '' : emailCheck.message
  usernameError.value = usernameCheck.valid ? '' : usernameCheck.message
  passwordError.value = passwordCheck.valid ? '' : passwordCheck.message

  if (emailCheck.valid && usernameCheck.valid && passwordCheck.valid) {
    const userData: User = {
      email: form.email,
      username: form.username,
      password: form.password,
      contactNumber: 0,
      age: 0,
      name: {
        firstName: '',
        lastName: '',
        middleName: '',
      },
      address: {
        street: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: 0,
        landmark: '',
      },
      userCart: [],
      userId: 0,
      userOrders: [],
    }

    const result = authStore.userRegistration(form.email, form.username, form.password, userData)
    if (result.success) {
      ElMessage.success(result.message)
      form.email = ''
      form.username = ''
      form.password = ''
      emailError.value = ''
      usernameError.value = ''
      passwordError.value = ''
      emit('update:visible', false )
    } else {
      ElMessage.error(result.message)
    }
  }
}
</script>

<style scoped>

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
}</style>
