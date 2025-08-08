<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ElLoading, ElMessage } from 'element-plus'
import { reactive, watchEffect } from 'vue'

const userStore = useUserStore()
const props = defineProps<{ visible: boolean; userId: number | null | undefined }>()
const emits = defineEmits(['update:visible', 'success'])

const form = reactive({
  name: '',
  username: '',
  email: '',
  street: '',
  city: '',
})

const handleSubmit = async () => {
  try {
    if (!props.userId) {
      return ElMessage.error('No user selected!')
    }

    const loadingInstance = ElLoading.service({
      lock: true,
      text: 'Editing....',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    await userStore.updateUser(props.userId, form)

    form.name = ''
    form.email = ''
    form.street = ''
    form.city = ''

    loadingInstance.close()
    ElMessage.success('Edit Successful!')
  } catch (error) {
    console.error(error)
  } finally {
    emits('update:visible', false)
  }
}

const clearForm = () => {
  form.name = ''
  form.email = ''
  form.street = ''
  form.city = ''
}

watchEffect(() => {
  //guard
  if (!props.visible || !props.userId || userStore.user.length === 0) return

  const user = userStore.user.find((u) => u.id === props.userId)
  console.log('user found:', user)

  if (user) {
    form.name = user.name || ''
    form.username = user.username || ''
    form.email = user.email || ''
    form.street = user.address?.street || ''
    form.city = user.address?.city || ''
  }
})
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
