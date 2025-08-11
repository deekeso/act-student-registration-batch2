<script lang="ts" setup>
import { userFormRule } from '@/rules/ruleForm'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, type FormInstance } from 'element-plus'
import { computed, reactive, ref, watchEffect } from 'vue'

const userStore = useUserStore()
const props = defineProps<{ visible: boolean; userId: number | null | undefined }>()
const emits = defineEmits(['update:visible', 'success'])
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  name: '',
  username: '',
  email: '',
  street: '',
  city: '',
})

const clearForm = () => {
  form.name = ''
  form.username = ''
  form.email = ''
  form.street = ''
  form.city = ''
}

const isFormComplete = computed(() => form.email && form.username && form.street && form.city)

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    if (!props.userId) {
      return ElMessage.error('No user selected!')
    }
    await formRef.value.validate()
    loading.value = true

    await new Promise((resolve) => setTimeout(resolve, 1500))
    await userStore.updateUser(props.userId, form)

    emits('success')
    clearForm()
  } catch (error) {
    ElMessage.error('Invalid inputs. Please try again')
    console.error('An error has occured: ', error)
  } finally {
    loading.value = false
  }
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
    destroy-on-close
  >
    <el-form
      :model="form"
      label-width="auto"
      label-position="top"
      ref="formRef"
      :rules="userFormRule"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" placeholder="Enter your name" />
      </el-form-item>
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" placeholder="Enter your name" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="Enter your email"
      /></el-form-item>
      <el-form-item label="Street" prop="street"
        ><el-input v-model="form.street" placeholder="Enter your street" />
      </el-form-item>

      <el-form-item label="City" prop="city">
        <el-input v-model="form.city" placeholder="Enter your city" />
      </el-form-item>

      <el-button :disabled="!isFormComplete" :loading="loading" native-type="submit"
        >Submit</el-button
      >
      <el-button @click="clearForm">Clear</el-button>
    </el-form>
  </el-drawer>
</template>
