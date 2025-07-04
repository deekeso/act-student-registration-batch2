<template>
  <div class="edit-form">
    <el-form
      @submit.prevent
      :model="state"
      :rules="rules"
      ref="formRef"
      @validate="handleValidate"
      label-position="top"
    >
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
            maxlength="30"
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
              maxlength="30"
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
              maxlength="30"
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
              maxlength="30"
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
      <div class="form-actions" style="margin-left: 8px">
        <!-- <el-button @click="handleCancel">Cancel</el-button> -->
        <el-button type="danger" @click="handleDelete">Delete</el-button>
        <el-button type="primary" @click="handleSubmit" style="margin-right: 10px"
          >Submit</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { useStudentActions } from '@/composables/useStudentActions'
import type { Student } from '@/types/Students'
import { courses } from '@/constants/index.ts'
import { formRules, entryRestriction } from '@/composables/formRules'
import { useBirthdayPicker, useBirthdayAutoAge, defaultBirthdayView } from '@/composables/birthday'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps<{
  editingStudent?: Student | null // Student object to be edited
}>()

// Define emits for the form
const emit = defineEmits<{
  (e: 'submit', data: Student): void
  (e: 'cancel'): void
  (e: 'delete', data: Student): void
}>()

// Define state for the form
const formRef = ref<FormInstance | null>(null)
const { state, submitForm } = useStudentActions(formRef)
const { onlyLetters, onlyDigits } = entryRestriction()
const { disabledDate } = useBirthdayPicker()
useBirthdayAutoAge(state)
const rules = formRules

// Watch for changes in the editingStudent prop and populate form
watch(
  () => props.editingStudent,
  (newStudent) => {
    if (newStudent) {
      console.log('Populating form with student data:', newStudent)
      Object.assign(state, {
        id: newStudent.id,
        firstName: newStudent.firstName,
        middleInitial: newStudent.middleInitial,
        lastName: newStudent.lastName,
        birthDate: newStudent.birthDate,
        age: Number(newStudent.age),
        streetAddress: newStudent.streetAddress,
        barangay: newStudent.barangay,
        city: newStudent.city,
        province: newStudent.province,
        zipCode: newStudent.zipCode,
        course: newStudent.course,
      })
    }
  },
  { immediate: true },
)

// Called when the component is mounted
onMounted(() => {
  console.log('EditForm mounted, editingStudent:', props.editingStudent)
  if (props.editingStudent) {
    console.log('Populating form with student data on mount:', props.editingStudent)
    Object.assign(state, {
      id: props.editingStudent.id,
      firstName: props.editingStudent.firstName,
      middleInitial: props.editingStudent.middleInitial,
      lastName: props.editingStudent.lastName,
      birthDate: props.editingStudent.birthDate,
      age: Number(props.editingStudent.age),
      streetAddress: props.editingStudent.streetAddress,
      barangay: props.editingStudent.barangay,
      city: props.editingStudent.city,
      province: props.editingStudent.province,
      zipCode: props.editingStudent.zipCode,
      course: props.editingStudent.course,
    })
  }
})

// Called when the form is validated
const handleValidate = (prop: string, isValid: boolean, error: unknown) => {
  if (!isValid) {
    console.log(`Validation failed for ${prop}:`, error)
  }
}

// Called when user submits the form
const handleSubmit = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to submit the changes to this student?',
      'Submit Confirmation',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      },
    )
    const result = await submitForm()
    if (result.success && result.data) {
      ElMessage.success('Student edited successfully!')
      emit('submit', result.data) // Emit the data to the parent component
    } else {
      console.error('Form submission failed:', result) // Log the error
    }
  } catch {
    // User cancelled, do nothing
  }
}

// Called when user cancels the form
// const handleCancel = async () => {
//   try {
//     await ElMessageBox.confirm(
//       'Are you sure you want to cancel? Unsaved changes will be lost.',
//       'Cancel Confirmation',
//       {
//         confirmButtonText: 'Yes',
//         cancelButtonText: 'No',
//         type: 'warning',
//       },
//     )
//     if (props.editingStudent) {
//       Object.assign(state, { ...props.editingStudent })
//     }
//     resetForm() // Reset the form
//     emit('cancel') // Emit the cancel event to the parent component
//   } catch {
//     // User cancelled, do nothing
//   }
// }

// Called when user deletes the student
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this student? This action cannot be undone.',
      'Delete Confirmation',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        // type: 'error',
      },
    )
    if (props.editingStudent) {
      emit('delete', { ...props.editingStudent }) // Emit the data to the parent component
    }
  } catch {
    // User cancelled, do nothing
  }
}
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 20px 120px 20px;
  max-width: 600px;
  margin: 0 auto;
  white-space: nowrap;
}

.edit-form :deep(.el-form) {
  width: 100%;
}

.edit-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.edit-form :deep(.el-form-item__label) {
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.edit-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 35px;
}

.edit-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(26, 58, 154, 0.2);
}

.edit-form :deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
}

.edit-form :deep(.el-date-editor .el-input__wrapper) {
  border-radius: 8px;
}

/* Card styling */
.edit-form :deep(.el-card) {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.edit-form :deep(.el-card__body) {
  padding: 30px;
}

.input_row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}

/* Section headers */
.edit-form h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a3a9a;
  /* margin: 30px 0 20px 0; */
  /* padding-bottom: 8px; */
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
  width: 100%;
}

.edit-form h4:first-child {
  margin-top: 0;
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

.form-actions .el-button--danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.form-actions .el-button--danger:hover {
  background-color: #c82333;
  border-color: #c82333;
}

/* Responsive design */
@media (max-width: 768px) {
  .edit-form {
    padding: 16px;
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

.edit-form :deep(.el-form-item__error) {
  color: var(--el-color-danger);
  font-size: 12px;
  padding: 4px;
  position: absolute;
  top: 100%;
  line-height: normal;
  right: 0;
  left: revert;
}

/* Form sections */
.name_row,
.birthday_row,
.address_row,
.course_row {
  width: 100%;
  margin-bottom: 10px;
}
</style>
