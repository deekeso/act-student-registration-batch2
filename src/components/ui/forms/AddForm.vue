<template>
  <div>
    <el-form :model="state" :rules="rules" ref="formRef">
      <div>
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
        <div class="input_row">
          <el-form-item label="Middle Initial" prop="middleInitial" required>
            <el-input
              id="middleInitial"
              type="text"
              v-model="state.middleInitial"
              style="width: 100%"
              placeholder="ex. S"
              maxlength="3"
              @keypress="onlyLetters"
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
              v-model="state.age"
              style="width: 100%"
              placeholder=""
              readonly
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
          <el-select v-model="state.course" id="course" placeholder="Select" style="width: 100%">
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
      <div class="form-actions">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
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
    const result = await submitForm()
    if (result.success && result.data) {
      // If the form is valid and data is returned
      emit('submit', result.data) // Emit the data to the parent component
      resetForm() // Reset the form
    } else {
      console.error('Form submission failed:', result)
    }
  } catch (error) {
    console.error('Submit error:', error) // Log the error
  }
}

// Called when user cancels the form
const handleCancel = () => {
  resetForm() // Reset the form
  emit('cancel') // Emit the cancel event to the parent component
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
