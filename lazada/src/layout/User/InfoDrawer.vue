<template>
  <el-drawer :model-value="visible" @close="onClose" title="Personal Information" size="30%">
    <el-form label-position="top" @submit.prevent="onSubmit">
      <div class="user-form">
        <div class="name">
          <h3>Name</h3>
          <el-form-item label="Last Name" prop="lastName">
            <el-input v-model="form.lastName" style="width: 100%" />
          </el-form-item>
          <el-form-item label="First Name" prop="firstName">
            <el-input v-model="form.firstName" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Middle Name" prop="middleName">
            <el-input v-model="form.middleName" style="width: 100%" />
          </el-form-item>
        </div>
        <div class="birthday">
          <h3>Birthday</h3>
          <el-form-item label="Birthday" prop="birthDate">
            <el-date-picker
              v-model="form.birthDate"
              id="birthDate"
              type="date"
              style="width: 100%"
              placeholder=""
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @keydown.prevent
            />
          </el-form-item>
          <el-form-item label="Age">
            <el-input
              v-model="form.age"
              id="age"
              type="number"
              style="width: 100%"
              placeholder=""
              readonly
            />
          </el-form-item>
        </div>

        <div class="address">
          <h3>Address</h3>
          <el-form-item label="Blk./Lot/No./Street" prop="street">
            <el-input v-model="form.street" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Barangay" prop="barangay">
            <el-input v-model="form.barangay" style="width: 100%" />
          </el-form-item>
          <el-form-item label="City" prop="city">
            <el-input v-model="form.city" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Province" prop="province">
            <el-input v-model="form.province" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Zip Code" prop="zipCode">
            <el-input v-model="form.zipCode" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Landmark" prop="landmark">
            <el-input v-model="form.landmark" style="width: 100%" />
          </el-form-item>
        </div>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import { reactive, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])

const form = reactive({
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  age: 0,
  street: '',
  barangay: '',
  city: '',
  province: '',
  zipCode: '',
  landmark: '',
})

// Load user info when drawer opens
watch(
  () => props.visible,
  (val) => {
    if (val) {
      const currentUsername = localStorage.getItem('currentUser')
      const users = JSON.parse(localStorage.getItem('Users') || '[]')
      const user = users.find((u: User) => u.username === currentUsername)
      if (user) {
        form.lastName = user.name?.lastName || ''
        form.firstName = user.name?.firstName || ''
        form.middleName = user.name?.middleName || ''
        form.birthDate = user.birthDate || ''
        form.age = user.age || 0
        form.street = user.address?.street || ''
        form.barangay = user.address?.barangay || ''
        form.city = user.address?.city || ''
        form.province = user.address?.province || ''
        form.zipCode = user.address?.zipCode?.toString() || ''
        form.landmark = user.address?.landmark || ''
      }
    }
  },
  { immediate: true },
)

// Submit handler
function onSubmit() {
  const currentUsername = localStorage.getItem('currentUser')
  const users = JSON.parse(localStorage.getItem('Users') || '[]')
  const userIndex = users.findIndex((u: User) => u.username === currentUsername)
  if (userIndex !== -1) {
    users[userIndex].name = {
      lastName: form.lastName,
      firstName: form.firstName,
      middleName: form.middleName,
    }
    users[userIndex].birthDate = form.birthDate
    users[userIndex].age = form.age
    users[userIndex].address = {
      street: form.street,
      barangay: form.barangay,
      city: form.city,
      province: form.province,
      zipCode: Number(form.zipCode) || 0,
      landmark: form.landmark,
    }
    localStorage.setItem('Users', JSON.stringify(users))
    emit('close')
  }
}

function onClose() {
  emit('close')
}
</script>

<style scoped>
:deep(.el-drawer) {
  background-color: #f0f0f0;
}

.user-form {
  padding: 10px 20px;
}
</style>
