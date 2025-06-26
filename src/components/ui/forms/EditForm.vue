<template>
  <div>
    <el-form @submit.prevent :model="state" :rules="rules" ref="formRef" @validate="handleValidate">
      <el-card>
        <div>
          <el-form-item label="Last Name" prop="lastName" required>
            <el-input
              id="lastName"
              type="text"
              v-model="state.lastName"
              style="width: 100%"
              placeholder="ex. Dela Cruz"
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
              @keypress="onlyLetters"
            />
          </el-form-item>
          <div class="input_row">
            <el-form-item label="Middle Initial">
              <el-input
                id="middleInitial"
                type="text"
                v-model="state.middleInitial"
                style="width: 100%"
                placeholder="ex. S"
                @keypress="onlyLetters"
                maxlength="3"
              />
            </el-form-item>
            <el-form-item label="Birthday" required prop="birthDate">
              <el-date-picker
                id="birthDate"
                type="date"
                v-model="state.birthDate"
                style="width: 100%"
                placeholder=""
                :disabled-date="disabledDate"
                required
              />
            </el-form-item>
            <el-form-item label="Age">
              <el-input
                id="age"
                type="number"
                v-model.number="state.age"
                style="width: 100%"
                placeholder=""
              />
            </el-form-item>
          </div>
          <el-form-item label="Street Address" prop="streetAddress" required>
            <el-input
              id="streetAddress"
              type="text"
              v-model="state.streetAddress"
              style="width: 100%"
              placeholder="ex. 123 Main Street"
            />
          </el-form-item>
          <div class="input_row">
            <el-form-item label="Barangay" prop="barangay" required>
              <el-input
                id="barangay"
                type="text"
                v-model="state.barangay"
                style="width: 100%"
                placeholder="ex. Barangay 1"
              />
            </el-form-item>
            <el-form-item label="City/Municipality" prop="city" required>
              <el-input
                id="city"
                type="text"
                v-model="state.city"
                style="width: 100%"
                placeholder="ex. Manila"
              />
            </el-form-item>
          </div>
          <div class="input_row">
            <el-form-item label="Province" prop="province" required>
              <el-input
                id="province"
                type="text"
                v-model="state.province"
                style="width: 100%"
                placeholder="ex. Metro Manila"
              />
            </el-form-item>
            <el-form-item label="Zip Code" prop="zipCode" required>
              <el-input
                id="zipCode"
                type="text"
                v-model="state.zipCode"
                style="width: 100%"
                placeholder="ex. 1000"
                maxlength="5"
                @keypress="onlyDigits"
              />
            </el-form-item>
          </div>
        </div>
        <div>
          <el-form-item label="Course" prop="course" required>
            <el-select
              v-model="state.course"
              id="course"
              placeholder="Select"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="course in courses"
                :key="course.value"
                :value="course.value"
                :label="course.label"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-actions">
          <el-button type="danger" @click="handleDelete">Delete</el-button>
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
        </div>
      </el-card>
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
import { useBirthdayPicker } from '@/composables/birthday'
import { useBirthdayAutoAge } from '@/composables/birthday'

const emit = defineEmits<{
  (e: 'submit', data: Student): void
  (e: 'cancel'): void
  (e: 'delete', data: Student): void
}>()

// Define state for the form
const formRef = ref<FormInstance | null>(null)
const { state, submitForm, resetForm, editingStudent } = useStudentActions(formRef)
const { onlyLetters, onlyDigits } = entryRestriction()
const { disabledDate } = useBirthdayPicker()
useBirthdayAutoAge(state)
const rules = formRules

// Called when the component is mounted
onMounted(() => {
  console.log('onMounted: formRef.value =', formRef.value)
})

// Watch for changes in the formRef
watch(formRef, (newVal) => {
  console.log('formRef changed:', newVal)
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
    const result = await submitForm()
    if (result.success && result.data) {
      emit('submit', result.data) // Emit the data to the parent component
    } else {
      console.error('Form submission failed:', result) // Log the error
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

// Called when user cancels the form
const handleCancel = () => {
  resetForm() // Reset the form
  emit('cancel') // Emit the cancel event to the parent component
}

// Called when user deletes the student
const handleDelete = () => {
  if (editingStudent.value) {
    emit('delete', { ...editingStudent.value }) // Emit the data to the parent component
  }
}
</script>

<style scoped>
.input_row {
  display: flex;
  gap: 16px;
}

.form-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
