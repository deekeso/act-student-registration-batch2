<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { reactive } from 'vue'

const userStore = useUserStore()
const props = defineProps<{ visible: boolean }>()
const emits = defineEmits(['update:visible', 'success'])

const form = reactive({
  name: '',
  username: '',
  email: '',
  street: '',
  city: '',
})

const handleSubmit = () => {
  userStore.createUser({
    name: form.name,
    username: form.username,
    email: form.email,
    address: {
      street: form.street,
      city: form.city,
    },
  })

  form.name = ''
  form.username = ''
  form.email = ''
  form.street = ''
  form.city = ''

  emits('success')
  emits('update:visible', false)
}

const clearForm = () => {
  form.name = ''
  form.username = ''
  form.email = ''
  form.street = ''
  form.city = ''
}
</script>

<template>
  <el-drawer
    :model-value="props.visible"
    @update:modelValue="(val: boolean) => emits('update:visible', val)"
  >
    <el-form :model="form" label-width="auto" label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="Name">
        <el-input v-model="form.name" placeholder="Enter your name" />
      </el-form-item>

      <el-form-item label="Username">
        <el-input v-model="form.username" placeholder="Enter your name" />
      </el-form-item>

      <el-form-item label="Email">
        <el-input v-model="form.email" placeholder="Enter your email"
      /></el-form-item>
      <el-form-item label="Street"
        ><el-input v-model="form.street" placeholder="Enter your street" />
      </el-form-item>

      <el-form-item label="City">
        <el-input v-model="form.city" placeholder="Enter your city" />
      </el-form-item>

      <el-button native-type="submit">Submit</el-button>
      <el-button @click="clearForm">Clear</el-button>
    </el-form>
  </el-drawer>
</template>
