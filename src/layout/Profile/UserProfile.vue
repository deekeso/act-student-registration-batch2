<template>
  <MainLayout>
    <div class="user-profile">
      <el-form label-position="top" @submit.prevent="onSubmit" ref="userFormRef"
        :model="form"
        :rules="userFormRules">
        <div class="user-form">
          <!-- Account Information -->
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
          <!-- Personal Information -->
          <div class="personal-info">
            <h3>Personal Information</h3>
            <h3>Name</h3>
            <el-form-item label="Last Name" prop="lastName">
              <el-input v-model="form.lastName" @keypress="lettersOnly" maxlength="30" style="width: 100%" @input="form.lastName = form.lastName.toUpperCase()"/>
            </el-form-item>
            <el-form-item label="First Name" prop="firstName">
              <el-input v-model="form.firstName" @keypress="lettersOnly" maxlength="30" style="width: 100%" @input="form.firstName = form.firstName.toUpperCase()" />
            </el-form-item>
            <el-form-item label="Middle Name" prop="middleName">
              <el-input v-model="form.middleName" @keypress="lettersOnly" maxlength="30" style="width: 100%" @input="form.middleName = form.middleName.toUpperCase()" />
            </el-form-item>
          </div>
          <!-- Birthday -->
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
          <!-- Address -->
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
          <div style="display: flex; justify-content: center;">
            <el-button type="primary" @click="onSubmit">Submit</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth';
import { reactive, ref, onMounted } from 'vue'
import { userFormRules } from '@/composables/formValidation';
import {
  numberOnly,
  lettersOnly,
  lettersNumbersOnly,
} from '@/composables/formValidationFunctions'
import { ElMessage } from 'element-plus';
import MainLayout from '../MainLayout.vue';
import { useBirthdayAutoAge, useBirthdayPicker } from '@/composables/formBirthday'

const userFormRef = ref()
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

useBirthdayAutoAge(form)
const { disabledDate } = useBirthdayPicker()

// Load user info on mount
onMounted(() => {
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
})

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
    // Optionally reload user info to sync
    authStore.loadUserInfo();
  } catch (error) {
    ElMessage.error('Failed to update profile. Please try again.');
    console.error('Update error:', error);
  }
}
</script>

<style scoped>
.user-profile {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: #D9D9D9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.05);
}

.name,
.personal-info,
.birthday,
.address {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.08);
}

h3 {
  color: #1A1A1A;
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 12px 0;
}

:deep(.el-form-item__label) {
  color: #1A1A1A;
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  background-color: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  padding: 8px;
  transition: border-color 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #1E90FF;
}

:deep(.el-input__inner) {
  color: #1A1A1A;
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-input__wrapper.is-disabled) {
  background-color: #F5F5F5;
  border-color: #D9D9D9;
  opacity: 0.7;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

:deep(.el-date-editor .el-input__wrapper) {
  background-color: #FFFFFF;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  padding: 8px;
}

:deep(.el-date-editor .el-input__wrapper:hover) {
  border-color: #1E90FF;
}

.el-button {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border-radius: 10px;
  width: 350px;
  height: 50px;
  margin-bottom: 20px;
  border: 1px solid #2e2e2e;
}


.el-button:hover {
  background-color: #e2e2e2;
  color: #2e2e2e;
  border: 1px solid #2e2e2e;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.5);
}

@media (max-width: 768px) {
  .user-profile {
    padding: 16px;
  }
  .user-form {
    padding: 16px;
  }
  .name,
  .personal-info,
  .birthday,
  .address {
    padding: 12px;
  }
  :deep(.el-button) {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
