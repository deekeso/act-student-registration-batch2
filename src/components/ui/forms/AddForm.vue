<template>
  <div class="add-form">
    <el-form :model="state" :rules="rules" ref="formRef" label-position="top">
      <div class="name_row">
        <h4>Name</h4>
        <el-form-item label="Last Name" prop="lastName" required>
          <el-input
            id="lastName"
            type="text"
            v-model="state.lastName"
            style="width: 100%"
            placeholder="ex. Dela Cruz"
            maxlength="30"
            @keypress="onlyLetters"
          />
        </el-form-item>
        <el-form-item label="First Name" prop="firstName" required>
          <el-input
            id="firstName"
            type="text"
            v-model="state.firstName"
            style="width: 100%"
            placeholder="ex. Juan"
            maxlength="30"
            @keypress="onlyLetters"
          />
        </el-form-item>
        <el-form-item label="Middle Initial" prop="middleInitial">
          <el-input
            id="middleInitial"
            type="text"
            v-model="state.middleInitial"
            style="width: 100%"
            placeholder="ex. S"
            maxlength="1"
            @keypress="onlyLetters"
          />
        </el-form-item>
      </div>
      <div class="birthday_row">
        <h4>Birthday</h4>
        <el-form-item label="Birthday" required prop="birthDate">
          <el-date-picker
            id="birthDate"
            type="date"
            v-model="state.birthDate"
            style="width: 100%"
            placeholder=""
            :disabled-date="disabledDate"
            :default-value="defaultBirthdayView"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @keydown.prevent
            required
          />
        </el-form-item>
        <el-form-item label="Age">
          <el-input
            id="age"
            type="number"
            v-model="state.age"
            style="width: 100%"
            placeholder=""
            readonly
          />
        </el-form-item>
      </div>
      <div class="address_row">
        <h4>Address</h4>
        <el-form-item label="Street Address" prop="streetAddress" required>
          <el-input
            id="streetAddress"
            type="text"
            v-model="state.streetAddress"
            style="width: 100%"
            placeholder="ex. 123 Main Street"
            maxlength="50"
          />
        </el-form-item>
        <div class="">
          <el-form-item label="Barangay" prop="barangay" required>
            <el-input
              id="barangay"
              type="text"
              v-model="state.barangay"
              style="width: 100%"
              placeholder="ex. Barangay 1"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="City/Municipality" prop="city" required>
            <el-input
              id="city"
              type="text"
              v-model="state.city"
              style="width: 100%"
              placeholder="ex. Manila"
              @keypress="onlyLetters"
              maxlength="50"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="Province" prop="province">
            <el-input
              id="province"
              type="text"
              v-model="state.province"
              style="width: 100%"
              placeholder="ex. Metro Manila"
              @keypress="onlyLetters"
              maxlength="50"
            />
          </el-form-item>
          <el-form-item label="Zip Code" prop="zipCode">
            <el-input
              id="zipCode"
              type="text"
              v-model="state.zipCode"
              style="width: 100%"
              placeholder="ex. 1000"
              maxlength="4"
              minlength="4"
              @keypress="onlyDigits"
              @click.right.prevent
              @copy.prevent
              @paste.prevent
            />
          </el-form-item>
        </div>
      </div>
      <div class="course_row">
        <h4>Program</h4>
        <el-form-item label="Course" prop="course" required>
          <el-select
            v-model="state.course"
            id="course"
            placeholder="Select"
            style="width: 100%"
            fit-input-width
          >
            <el-option disabled value="">Please select one</el-option>
            <el-option
              v-for="course in courses"
              :key="course.value"
              :value="course.value"
              :label="course.label"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-actions" style="padding-bottom: 20px">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit" style="margin-right: 10px"
          >Submit</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { Student } from '@/types/Students'
import { courses } from '@/constants/index'
import { useStudentActions } from '@/composables/useStudentActions'
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { formRules, entryRestriction } from '@/composables/formRules'
import { useBirthdayPicker } from '@/composables/birthday'
import { useBirthdayAutoAge } from '@/composables/birthday'
import { defaultBirthdayView } from '@/composables/birthday'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps<{
  initialData?: Partial<Student>
}>()

const rules = formRules
const { onlyLetters, onlyDigits } = entryRestriction()
const { disabledDate } = useBirthdayPicker()
const emit = defineEmits<{
  (e: 'submit', data: Student): void
  (e: 'cancel'): void
}>()

// Define state for the form
const formRef = ref<FormInstance | null>(null)
const { state, submitForm, resetForm } = useStudentActions(formRef)
useBirthdayAutoAge(state)

// If initialData is provided, assign it to the state
if (props.initialData) {
  Object.assign(state, props.initialData)
}

// Called when user submits the form
const handleSubmit = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to submit this student?',
      'Submit Confirmation',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        // type: 'warning',
      },
    )
    const result = await submitForm()
    if (result.success && result.data) {
      ElMessage.success('Student added successfully!')
      emit('submit', result.data) // Emit the data to the parent component
      resetForm() // Reset the form
    } else {
      console.error('Form submission failed:', result)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      ElMessage.error('Failed to add student: A student with identical details already exists.')
    }
  } catch {
    // User cancelled, do nothing
  }
}

// Called when user cancels the form
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel? Unsaved changes will be lost.',
      'Cancel Confirmation',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        // type: 'warning',
      },
    )
    resetForm() // Reset the form
    emit('cancel') // Emit the cancel event to the parent component
  } catch {
    // User cancelled, do nothing
  }
}

defineExpose({
  resetForm,
})
</script>

<style scoped>
.el-form {
  height: 80vh;
}
:deep(.el-form-item__error) {
  color: var(--el-color-danger);
  font-size: 12px;
  padding: 4px;
  position: absolute;
  top: 100%;
  line-height: normal;
  right: 0;
  left: revert;
}
.add-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px 10px 20px;
  max-width: 600px;
  margin: 0 auto;
  white-space: nowrap;
}

.add-form :deep(.el-form) {
  width: 100%;
}

.add-form :deep(.el-form-item__label) {
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.add-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 35px;
}

.add-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(26, 58, 154, 0.2);
}

.add-form :deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

.add-form :deep(.el-date-editor .el-input__wrapper) {
  border-radius: 8px;
}
/* Section headers */
.add-form h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a3a9a;
  /* margin: 30px 0 20px 0; */
  /* padding-bottom: 8px; */
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
  width: 100%;
}

.add-form h4:first-child {
  margin-top: 0;
}

/* Form sections */
.name_row,
.birthday_row,
.address_row,
.course_row {
  width: 100%;
  margin-bottom: 10px;
}

/* Input rows for side-by-side fields */
.input_row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

/* Form actions */
.form-actions {
  /* margin-top: 40px; */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.form-actions .el-button {
  width: 100%;
  /* padding: 12px 24px; */
  border-radius: 10px;
  font-weight: 500;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.form-actions .el-button--primary {
  background-color: #1a3a9a;
  border-color: #1a3a9a;
}

.form-actions .el-button--primary:hover {
  background-color: #264eca;
  border-color: #264eca;
}

/* Responsive design */
@media (max-width: 768px) {
  .add-form {
    padding: 16px 16px 25px 16px;
  }

  .input_row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column;
    align-items: center;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
