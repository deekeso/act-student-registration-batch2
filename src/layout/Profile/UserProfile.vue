<template>
  <MainLayout>
    <div class="user-profile">
      <div class="sidebar">
        <el-menu :default-active="activeSection" class="sidebar-menu" @select="handleSectionSelect">
          <el-menu-item index="account">Account Information</el-menu-item>
          <el-menu-item index="personal">Personal Information</el-menu-item>
          <el-menu-item index="address">Address</el-menu-item>
          <el-menu-item index="password">Change Password</el-menu-item>
        </el-menu>
      </div>
      <div class="content">
        <!-- Account Information Form -->
        <div v-if="activeSection === 'account'" class="user-form">
          <el-form
            label-position="top"
            @submit.prevent="onSubmitAccount"
            ref="accountFormRef"
            :model="accountForm"
            :rules="accountFormRules"
            class="form-section"
          >
            <div class="name">
              <div class="edit-container">
                <h3>Account Information</h3>
                <el-icon @click="toggleEdit" class="edit-icon" title="Edit"><EditPen /></el-icon>
              </div>
              <strong>Username</strong>
              <h3>{{ accountForm.username }}</h3>
              <strong>Email</strong>
              <h3>{{ accountForm.email }}</h3>
              <el-form-item label="Contact Number" prop="contactNumber">
                <el-input
                  v-model="accountForm.contactNumber"
                  @keypress="numberOnly"
                  maxlength="10"
                  style="width: 100%"
                  placeholder="9123456789"
                  :disabled="isDisabled"
                />
              </el-form-item>
            </div>
          </el-form>
          <div style="display: flex; justify-content: center">
            <el-button type="primary" @click="onSubmitAccount" :disabled="isDisabled"
              >Save changes</el-button
            >
            <el-button link @click="router.push('/')" v-if="route.query.from === 'register'"
              >Skip</el-button
            >
          </div>
        </div>

        <!-- Personal Information Form (including Birthday) -->
        <div v-if="activeSection === 'personal'" class="user-form">
          <el-form
            label-position="top"
            @submit.prevent="onSubmitPersonal"
            ref="personalFormRef"
            :model="personalForm"
            :rules="personalFormRules"
            class="form-section"
            :disabled="isDisabled"
          >
            <div class="personal-info">
              <div class="edit-container">
                <h3>Personal Information</h3>
                <el-icon @click="toggleEdit" class="edit-icon" title="Edit"><EditPen /></el-icon>
              </div>
              <el-form-item label="Last Name" prop="lastName">
                <el-input
                  v-model="personalForm.lastName"
                  @keypress="lettersOnly"
                  maxlength="30"
                  style="width: 100%"
                  @input="personalForm.lastName = personalForm.lastName.toUpperCase()"
                />
              </el-form-item>
              <el-form-item label="First Name" prop="firstName">
                <el-input
                  v-model="personalForm.firstName"
                  @keypress="lettersOnly"
                  maxlength="30"
                  style="width: 100%"
                  @input="personalForm.firstName = personalForm.firstName.toUpperCase()"
                />
              </el-form-item>
              <el-form-item label="Middle Name" prop="middleName">
                <el-input
                  v-model="personalForm.middleName"
                  @keypress="lettersOnly"
                  maxlength="30"
                  style="width: 100%"
                  @input="personalForm.middleName = personalForm.middleName.toUpperCase()"
                />
              </el-form-item>
              <h3>Birthday</h3>
              <el-form-item label="Birthday" prop="birthDate">
                <el-date-picker
                  v-model="personalForm.birthDate"
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
                  v-model="personalForm.age"
                  id="age"
                  type="number"
                  style="width: 100%"
                  placeholder=""
                  readonly
                />
              </el-form-item>
            </div>
          </el-form>
          <div style="display: flex; justify-content: center">
            <el-button type="primary" @click="onSubmitPersonal" :disabled="isDisabled"
              >Save changes</el-button
            >
            <el-button link @click="router.push('/')" v-if="route.query.from === 'register'"
              >Skip</el-button
            >
          </div>
        </div>

        <!-- Address Form -->
        <div v-if="activeSection === 'address'" class="user-form">
          <el-form
            label-position="top"
            @submit.prevent="onSubmitAddress"
            ref="addressFormRef"
            :model="addressForm"
            :rules="addressFormRules"
            class="form-section"
            :disabled="isDisabled"
          >
            <div class="address">
              <div class="edit-container">
                <h3>Address</h3>
                <el-icon @click="toggleEdit" class="edit-icon" title="Edit"><EditPen /></el-icon>
              </div>
              <el-form-item label="Blk./Lot/No./Street" prop="street">
                <el-input
                  v-model="addressForm.street"
                  @keypress="lettersNumbersOnly"
                  maxlength="50"
                  style="width: 100%"
                  @input="addressForm.street = addressForm.street.toUpperCase()"
                  placeholder="e.g., Blk 1 Lot 2 Name St."
                />
              </el-form-item>
              <el-form-item label="Barangay" prop="barangay">
                <el-input
                  v-model="addressForm.barangay"
                  @keypress="lettersNumbersOnly"
                  maxlength="50"
                  style="width: 100%"
                  @input="addressForm.barangay = addressForm.barangay.toUpperCase()"
                  placeholder="e.g., Brgy. San Antonio"
                />
              </el-form-item>
              <el-form-item label="City" prop="city">
                <el-input
                  v-model="addressForm.city"
                  @keypress="lettersOnly"
                  maxlength="50"
                  style="width: 100%"
                  @input="addressForm.city = addressForm.city.toUpperCase()"
                  placeholder="e.g., Manila City"
                />
              </el-form-item>
              <el-form-item label="Province" prop="province">
                <el-input
                  v-model="addressForm.province"
                  @keypress="lettersOnly"
                  maxlength="50"
                  style="width: 100%"
                  @input="addressForm.province = addressForm.province.toUpperCase()"
                  placeholder="e.g., Metro Manila"
                />
              </el-form-item>
              <el-form-item label="Zip Code" prop="zipCode">
                <el-input
                  v-model="addressForm.zipCode"
                  @keypress="numberOnly"
                  maxlength="4"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="Landmark" prop="landmark">
                <el-input
                  v-model="addressForm.landmark"
                  @keypress="lettersNumbersOnly"
                  maxlength="50"
                  style="width: 100%"
                  @input="addressForm.landmark = addressForm.landmark.toUpperCase()"
                  placeholder="e.g., Near SM Mall"
                />
              </el-form-item>
            </div>
          </el-form>
          <div style="display: flex; justify-content: center">
            <el-button type="primary" @click="onSubmitAddress" :disabled="isDisabled"
              >Save changes</el-button
            >
            <el-button link @click="router.push('/')" v-if="route.query.from === 'register'"
              >Skip</el-button
            >
          </div>
        </div>

        <!-- Change Password Form -->
        <div v-if="activeSection === 'password'" class="user-form">
          <el-form label-position="top" class="form-section">
            <div class="password">
              <div>
                <h3>Change Password</h3>
              </div>
              <el-form-item label="Username" :error="usernameError">
                <el-input
                  v-model="username"
                  style="width: 100%"
                  placeholder="Enter your username"
                  @keyup.enter="handleSubmit"
                />
              </el-form-item>
              <el-form-item label="Email" :error="emailError">
                <el-input
                  v-model="email"
                  style="width: 100%"
                  type="email"
                  placeholder="Enter your email"
                  @keyup.enter="handleSubmit"
                />
              </el-form-item>
              <el-form-item label="New Password" :error="passwordError">
                <el-input
                  v-model="newPassword"
                  style="width: 100%"
                  type="password"
                  placeholder="Enter new password"
                  show-password
                  @keyup.enter="handleSubmit"
                />
              </el-form-item>
              <el-form-item label="Confirm Password" :error="confirmPasswordError">
                <el-input
                  v-model="confirmPassword"
                  style="width: 100%"
                  type="password"
                  placeholder="Confirm new password"
                  show-password
                  @keyup.enter="handleSubmit"
                />
              </el-form-item>
            </div>
          </el-form>
          <div style="display: flex; justify-content: center">
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/userAuth'
import { reactive, ref, onMounted } from 'vue'
import { userFormRules } from '@/composables/formValidation'
import { numberOnly, lettersOnly, lettersNumbersOnly } from '@/composables/formValidationFunctions'
import { ElMessage } from 'element-plus'
import MainLayout from '../MainLayout.vue'
import { useBirthdayAutoAge, useBirthdayPicker } from '@/composables/formBirthday'
import router from '@/router'
import { EditPen } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import {
  validateConfirmPasswordField,
  validateEmailField,
  validatePasswordField,
  validateUsernameField,
} from '@/composables/userValidation'

// Sidebar state
const activeSection = ref('account')

// Form references
const accountFormRef = ref()
const personalFormRef = ref()
const addressFormRef = ref()

// Form data
const accountForm = reactive({
  username: '',
  email: '',
  contactNumber: '',
})

const personalForm = reactive({
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  age: 0,
})

const addressForm = reactive({
  street: '',
  barangay: '',
  city: '',
  province: '',
  zipCode: 0,
  landmark: '',
})

// Form validation rules
const accountFormRules = {
  // username: userFormRules.username,
  // email: userFormRules.email,
  contactNumber: userFormRules.contactNumber,
}

const personalFormRules = {
  lastName: userFormRules.lastName,
  firstName: userFormRules.firstName,
  middleName: userFormRules.middleName,
  birthDate: userFormRules.birthDate,
}

const addressFormRules = {
  street: userFormRules.street,
  barangay: userFormRules.barangay,
  city: userFormRules.city,
  province: userFormRules.province,
  zipCode: userFormRules.zipCode,
  landmark: userFormRules.landmark,
}

// Initialize birthday auto age
useBirthdayAutoAge(personalForm)
const { disabledDate } = useBirthdayPicker()

const authStore = useAuthStore()
const route = useRoute()

// Load user info on mount
onMounted(() => {
  authStore.loadUserInfo()
  const user = authStore.userInfo
  if (user) {
    accountForm.username = user.username || ''
    accountForm.email = user.email || ''
    accountForm.contactNumber = user.contactNumber || ''
    personalForm.lastName = user.name?.lastName || ''
    personalForm.firstName = user.name?.firstName || ''
    personalForm.middleName = user.name?.middleName || ''
    personalForm.birthDate = user.birthDate || ''
    personalForm.age = user.age || 0
    addressForm.street = user.address?.street || ''
    addressForm.barangay = user.address?.barangay || ''
    addressForm.city = user.address?.city || ''
    addressForm.province = user.address?.province || ''
    addressForm.zipCode = user.address?.zipCode || 0
    addressForm.landmark = user.address?.landmark || ''
  }
})

// Sidebar navigation handler
const handleSectionSelect = (index: string) => {
  activeSection.value = index
}

// Toggle edit state
const isDisabled = ref(true)

const toggleEdit = () => {
  isDisabled.value = !isDisabled.value
  if (!isDisabled.value) {
    ElMessage.info('You can now edit the fields.')
  } else {
    ElMessage.info('Fields are now read-only.')
  }
}

// Submit handlers
async function onSubmitAccount() {
  try {
    const valid = await accountFormRef.value.validate()
    if (!valid) {
      ElMessage.error('Please fix the errors in the Account Information form.')
      return
    }
    authStore.userUpdateInfo({
      contactNumber: accountForm.contactNumber,
    })
    ElMessage.success('Account Information updated successfully.')
    authStore.loadUserInfo()
  } catch (error) {
    ElMessage.error('Failed to update Account Information. Please try again.')
    console.error('Update error:', error)
  }
}

async function onSubmitPersonal() {
  try {
    const valid = await personalFormRef.value.validate()
    if (!valid) {
      ElMessage.error('Please fix the errors in the Personal Information form.')
      return
    }
    authStore.userUpdateInfo({
      birthDate: personalForm.birthDate,
      age: personalForm.age,
      name: {
        lastName: personalForm.lastName,
        firstName: personalForm.firstName,
        middleName: personalForm.middleName,
      },
    })
    ElMessage.success('Personal Information updated successfully.')
    authStore.loadUserInfo()
  } catch (error) {
    ElMessage.error('Failed to update Personal Information. Please try again.')
    console.error('Update error:', error)
  }
}

async function onSubmitAddress() {
  try {
    const valid = await addressFormRef.value.validate()
    if (!valid) {
      ElMessage.error('Please fix the errors in the Address form.')
      return
    }
    authStore.userUpdateInfo({
      address: {
        street: addressForm.street,
        barangay: addressForm.barangay,
        city: addressForm.city,
        province: addressForm.province,
        zipCode: Number(addressForm.zipCode) || 0,
        landmark: addressForm.landmark,
      },
    })
    ElMessage.success('Address updated successfully.')
    authStore.loadUserInfo()
  } catch (error) {
    ElMessage.error('Failed to update Address. Please try again.')
    console.error('Update error:', error)
  }
}

// Password change logic
const emit = defineEmits(['update:visible', 'submit'])

const username = ref('')
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

function handleSubmit() {
  const usernameCheck = validateUsernameField(username.value)
  const emailCheck = validateEmailField(email.value)
  const passwordCheck = validatePasswordField(newPassword.value)
  const confirmPasswordCheck = validateConfirmPasswordField(
    newPassword.value,
    confirmPassword.value,
  )

  usernameError.value = usernameCheck.valid ? '' : usernameCheck.message
  emailError.value = emailCheck.valid ? '' : emailCheck.message
  passwordError.value = passwordCheck.valid ? '' : passwordCheck.message
  confirmPasswordError.value = confirmPasswordCheck.valid ? '' : confirmPasswordCheck.message

  if (
    usernameCheck.valid &&
    emailCheck.valid &&
    passwordCheck.valid &&
    confirmPasswordCheck.valid
  ) {
    const result = authStore.resetPassword(
      username.value,
      email.value,
      newPassword.value,
      confirmPassword.value,
    )
    if (result.success) {
      ElMessage.success(result.message)
      emit('update:visible', false)
      username.value = ''
      email.value = ''
      newPassword.value = ''
      confirmPassword.value = ''

      authStore.userLogout()
      authStore.loadUserInfo()
      router.push('/')
      new Promise((resolve) => setTimeout(resolve, 1000))
    } else {
      ElMessage.error(result.message)
    }
  }
}
</script>

<style scoped>
.user-profile {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.sidebar {
  width: 250px;
  background-color: #d9d9d9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.05);
}

.sidebar-menu {
  background-color: transparent;
  border-right: none;
}

:deep(.el-menu-item) {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  margin-bottom: 8px;
}

:deep(.el-menu-item.is-active) {
  background-color: #e2e2e2;
  color: #2e2e2e;
}

:deep(.el-menu-item:hover) {
  background-color: #e2e2e2;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: #d9d9d9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(46, 46, 46, 0.05);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.edit-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-icon {
  cursor: pointer;
  color: #1e90ff;
  font-size: 18px;
  top: -2px;
  left: -20px;
}

.edit-icon:hover {
  color: #abafb6;
}

.account-info {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}
.name,
.personal-info,
.address,
.password {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(46, 46, 46, 0.08);
}

h3 {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 16px;
}

:deep(.el-form-item__label) {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  transition: border-color 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #1e90ff;
}

:deep(.el-input__inner) {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-input__wrapper.is-disabled) {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  opacity: 0.7;
}

:deep(.el-date-editor.el-input) {
  width: 100%;
}

:deep(.el-date-editor .el-input__wrapper) {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  height: 48px;
}

:deep(.el-date-editor .el-input__wrapper:hover) {
  border-color: #1e90ff;
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

.el-button.is-disabled {
  background-color: #f5f5f5;
  color: #bfbfbf;
  border: 1px solid #d9d9d9;
  cursor: not-allowed;
}

:deep(.el-button.is-disabled:hover) {
  background-color: #f5f5f5;
  color: #bfbfbf;
  border: 1px solid #d9d9d9;
  box-shadow: none;
}

@media (max-width: 1024px) {
  .user-profile {
    flex-direction: column;
    padding: 16px;
  }
  .sidebar {
    width: 100%;
    margin-bottom: 16px;
  }
  .content {
    width: 100%;
  }
  .user-form {
    padding: 16px;
  }
  .name,
  .personal-info,
  .address {
    padding: 12px;
  }
  :deep(.el-button) {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
