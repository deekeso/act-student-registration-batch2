<template>
  <el-drawer :model-value="visible" @close="onClose" title="Personal Information" size="30%">
    <el-form label-position="top" @submit.prevent="onSubmit" ref="userFormRef"
  :model="form"
  :rules="userFormRules">
      <div class="user-form">
        <div class="name">
          <h3>Account Information</h3>
          <el-form-item label="Username" prop="username">
            <el-input v-model="form.username" style="width: 100%" readonly />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" style="width: 100%" readonly />
          </el-form-item>
          <el-form-item label="Contact Number" prop="contactNumber">
            <el-input
              v-model="form.contactNumber"
              @keypress="numberOnly"
              maxlength="10"
              style="width: 100%"
              placeholder="9123456789"
            />
          </el-form-item>
        </div>
        <div class="personal-info">
          <h3>Personal Information</h3>
          <h3>Name</h3>
          <el-form-item label="Last Name" prop="lastName">
            <el-input v-model="form.lastName" @keypress="lettersOnly" maxlength="30" style="width: 100%"  @input="form.lastName = form.lastName.toUpperCase()"/>
          </el-form-item>
          <el-form-item label="First Name" prop="firstName">
            <el-input v-model="form.firstName" @keypress="lettersOnly" maxlength="30" style="width: 100%" @input="form.firstName = form.firstName.toUpperCase()" />
          </el-form-item>
          <el-form-item label="Middle Name" prop="middleName">
            <el-input v-model="form.middleName" @keypress="lettersOnly" maxlength="30" style="width: 100%" @input="form.middleName = form.middleName.toUpperCase()" />
          </el-form-item>
        </div>
        <div class="birthday">
          <h3>Birthday</h3>
          <el-form-item label="Birthday" prop="birthDate">
            <el-date-picker
              v-model="form.birthDate"
              type="date"
              style="width: 100%"
              :disabled-date="disabledDate"
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
            <el-input v-model="form.street" @keypress="lettersNumbersOnly" maxlength="50" style="width: 100%" @input="form.street = form.street.toUpperCase()"/>
          </el-form-item>
          <el-form-item label="Barangay" prop="barangay">
            <el-input v-model="form.barangay" @keypress="lettersNumbersOnly" maxlength="50" style="width: 100%" @input="form.barangay = form.barangay.toUpperCase()" />
          </el-form-item>
          <el-form-item label="City" prop="city">
            <el-input v-model="form.city" @keypress="lettersOnly" maxlength="50" style="width: 100%" @input="form.city = form.city.toUpperCase()" />
          </el-form-item>
          <el-form-item label="Province" prop="province">
            <el-input v-model="form.province" @keypress="lettersOnly" maxlength="50" style="width: 100%" @input="form.province = form.province.toUpperCase()" />
          </el-form-item>
          <el-form-item label="Zip Code" prop="zipCode">
            <el-input v-model="form.zipCode" @keypress="numberOnly" maxlength="4" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Landmark" prop="landmark">
            <el-input v-model="form.landmark" @keypress="lettersNumbersOnly" maxlength="50" style="width: 100%" @input="form.landmark = form.landmark.toUpperCase()" />
          </el-form-item>
        </div>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth';
import { reactive, ref, watch } from 'vue'
import { userFormRules } from '@/composables/formValidation';
import {
  numberOnly,
  lettersOnly,
  lettersNumbersOnly,
} from '@/composables/formValidationFunctions'
import { ElMessage } from 'element-plus';
import { useBirthdayAutoAge, useBirthdayPicker } from '@/composables/formBirthday';
// import { useBirthdayPicker, useBirthdayAutoAge, defaultBirthdayView } from '@/composables/formBirthday'

const userFormRef = ref()
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])
const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  contactNumber: 0,
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  age: 0,
  street: '',
  barangay: '',
  city: '',
  province: '',
  zipCode: 0,
  landmark: '',
})

// Use birthday picker and auto-age
const { disabledDate } = useBirthdayPicker()
useBirthdayAutoAge(form)

// Load user info when drawer opens
watch(
  () => props.visible,
  (val) => {
  if (val) {
    authStore.loadUserInfo()
    const user = authStore.userInfo
      if (user) {
        form.username = user.username || ''
        form.email = user.email || ''
        form.contactNumber = user.contactNumber || 0
        form.lastName = user.name?.lastName || ''
        form.firstName = user.name?.firstName || ''
        form.middleName = user.name?.middleName || ''
        form.birthDate = user.birthDate || ''
        form.age = user.age || 0
        form.street = user.address?.street || ''
        form.barangay = user.address?.barangay || ''
        form.city = user.address?.city || ''
        form.province = user.address?.province || ''
        form.zipCode = user.address?.zipCode || 0
        form.landmark = user.address?.landmark || ''
      }
    }
  },
  { immediate: true },
)

// Submit handler
async function onSubmit() {
  try {
    // Validate the form
    const valid = await userFormRef.value.validate();
    if (!valid) {
      ElMessage.error('Please fix the errors in the form.');
      return;
    }

    // If all validations pass, update user info
    authStore.userUpdateInfo({
      contactNumber: form.contactNumber,
      birthDate: form.birthDate,
      age: form.age,
      name: {
        lastName: form.lastName,
        firstName: form.firstName,
        middleName: form.middleName,
      },
      address: {
        street: form.street,
        barangay: form.barangay,
        city: form.city,
        province: form.province,
        zipCode: Number(form.zipCode) || 0,
        landmark: form.landmark,
      },
    });

    ElMessage.success('Profile updated successfully.');
    emit('close');
  } catch (error) {
    ElMessage.error('Failed to update profile. Please try again.');
    console.error('Update error:', error);
  }
}

function onClose() {
  userFormRef.value.resetFields();
  emit('close');
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
