<template>
  <el-dialog
    :model-value="props.visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    title="Add user"
  >
    <el-form label-position="top">
      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input v-model="addUserForm.name" placeholder="" />
      </el-form-item>

      <el-form-item label="Username" prop="username" :error="errors.username">
        <el-input v-model="addUserForm.username" placeholder="" />
      </el-form-item>

      <el-form-item label="Email" prop="email" :error="errors.email">
        <el-input v-model="addUserForm.email" placeholder="" />
      </el-form-item>

      <el-form-item label="Street" prop="street" :error="errors.address">
        <el-input v-model="addUserForm.address.street" placeholder="" />
      </el-form-item>

      <el-form-item label="City" prop="city" :error="errors.address">
        <el-input v-model="addUserForm.address.city" placeholder="" />
      </el-form-item>

      <el-button type="primary" @click="handleAddSubmit">Submit</el-button>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { NewUser } from '@/types/user'
import { formValidation, type UserData } from '@/utils/formValidation'
import { dayjs, ElMessage } from 'element-plus'
import { reactive } from 'vue'
import type z from 'zod'

const addUserForm = reactive<UserData>({
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    city: '',
  },
})

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'addUser', user: NewUser): void
}>()

const errors = reactive<Partial<Record<keyof UserData, string>>>({})

const handleAddSubmit = async () => {
  const result = formValidation.safeParse(addUserForm)

  Object.keys(errors).forEach((key) => delete errors[key as keyof UserData])

  if (!result.success) {
    const zodError = result.error as z.ZodError<UserData>
    zodError.issues.forEach((issue) => {
      const field = issue.path[0] as keyof UserData
      errors[field] = issue.message
    })

    ElMessage.warning('Unable to submit new user')
    return
  }

  try {
    const newUser = {
      ...addUserForm,
      createdAt: dayjs().format('YYYY-MM-DD'),
    }

    emit('addUser', newUser)

    ElMessage.success('User added successfully!')
    console.log('New user:', newUser)

    emit('update:visible', false)

    // clear form
    addUserForm.name = ''
    addUserForm.username = ''
    addUserForm.email = ''
    addUserForm.address.street = ''
    addUserForm.address.city = ''
  } catch (error) {
    console.error(error)
    ElMessage.error('Failed to add student.')
  }
}
</script>

<style scoped></style>
