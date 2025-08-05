<template>
  <el-dialog
    :model-value="props.visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    title="Edit User"
  >
    <el-form label-position="top">
      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input v-model="editUserForm.name" />
      </el-form-item>

      <el-form-item label="Username" prop="username" :error="errors.username">
        <el-input v-model="editUserForm.username" />
      </el-form-item>

      <el-form-item label="Email" prop="email" :error="errors.email">
        <el-input v-model="editUserForm.email" />
      </el-form-item>

      <el-form-item label="Street" prop="street" :error="errors.address">
        <el-input v-model="editUserForm.address.street" />
      </el-form-item>

      <el-form-item label="City" prop="city" :error="errors.address">
        <el-input v-model="editUserForm.address.city" />
      </el-form-item>

      <el-button type="primary" @click="handleEditSubmit">Update</el-button>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { User } from '@/types/user'
import { formValidation, type UserData } from '@/utils/formValidation'
import type z from 'zod'

const props = defineProps<{
  visible: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'updateUser', user: User): void
}>()

// Reactive form
const editUserForm = reactive<UserData>({
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    city: '',
  },
})

// Sync prop.user → form
watch(
  () => props.user,
  (user) => {
    if (user) {
      editUserForm.name = user.name
      editUserForm.username = user.username
      editUserForm.email = user.email
      editUserForm.address.street = user.address.street
      editUserForm.address.city = user.address.city
    }
    console.log('Edit user:', props.user)
  },
  { immediate: true },
)

const errors = reactive<Partial<Record<keyof UserData, string>>>({})

const handleEditSubmit = async () => {
  const result = formValidation.safeParse(editUserForm)

  Object.keys(errors).forEach((key) => delete errors[key as keyof UserData])

  if (!result.success) {
    const zodError = result.error as z.ZodError<UserData>
    zodError.issues.forEach((issue) => {
      const field = issue.path[0] as keyof UserData
      errors[field] = issue.message
    })
    return
  }

  try {
    if (!props.user) return

    const updatedUser: User = {
      ...props.user,
      ...editUserForm,
    }

    emit('updateUser', updatedUser)
    ElMessage.success('User updated successfully!')
    console.log('Updated user:', updatedUser)

    emit('update:visible', false)
  } catch (error) {
    console.error(error)
    ElMessage.error('Failed to update user.')
  }
}
</script>

<style scoped></style>
