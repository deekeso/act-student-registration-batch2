<script lang="ts" setup>
import { userFormRule } from '@/rules/ruleForm'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, type FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'

const userStore = useUserStore()
const props = defineProps<{ visible: boolean }>()
const formRef = ref<FormInstance>()
const emits = defineEmits(['update:visible', 'success'])
const loading = ref(false)

const form = reactive({
  name: '',
  username: '',
  email: '',
  street: '',
  city: '',
})

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    await new Promise((resolve) => setTimeout(resolve, 1500))
    userStore.createUser({
      name: form.name,
      username: form.username,
      email: form.email,
      address: {
        street: form.street,
        city: form.city,
      },
    })

    clearForm()
    emits('success')
  } catch (error) {
    ElMessage.error('Invalid Inputs. Please try again')
    console.error('An error has occured: ', error)
  } finally {
    loading.value = false
  }
}

const isFormComplete = computed(() => form.email && form.username && form.street && form.city)

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
