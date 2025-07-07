<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-position="top"
    @submit.prevent="validateAndSubmit"
    class="student-form"
  >
    <el-form-item label="First Name" prop="firstName">
      <el-input v-model="formData.firstName" placeholder="Enter first name" @blur="formatFirstName" maxlength="70" show-word-limit />
    </el-form-item>

    <!-- Middle initial, optional and limited to 1 character -->
    <el-form-item label="Middle Initial" prop="middleInitial">
      <el-input
        v-model="formData.middleInitial"
        placeholder="Enter middle initial"
        maxlength="1"
        show-word-limit
        @blur="formatMiddleInitial"
      />
    </el-form-item>

    <el-form-item label="Last Name" prop="lastName">
      <el-input v-model="formData.lastName" placeholder="Enter last name" @blur="formatLastName" maxlength="70" show-word-limit />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="Birth Date" prop="birthDate" class="birth-date">
          <el-date-picker
            v-model="formData.birthDate"
            type="date"
            placeholder="Select birth date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="calculateAge"
            style="width: 100%"
            :disabled-date="disabledDates"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="Age" prop="age">
          <el-input v-model="formData.age" type="number" readonly />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Address" prop="address">
      <el-input v-model="formData.address" type="textarea" rows="3" placeholder="Enter address" maxlength="500" show-word-limit />
    </el-form-item>

    <el-form-item label="Course" prop="course">
      <el-select v-model="formData.course" placeholder="Select a course" fit-input-width>
        <el-option
          v-for="course in availableCourses"
          :key="course"
          :label="course"
          :value="course"
        />
      </el-select>
    </el-form-item>

    <!-- Form actions -->
    <div class="form-actions">
      <el-button @click="resetForm">Reset</el-button>
      <!-- Submit button, text dependent on existing studentID (Update or Add Student) -->
      <el-button type="primary" native-type="submit">{{ submitButtonText }}</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { useStudentStore } from '@/stores/student'
import type { Student } from '@/stores/student'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { ElForm, type FormItemRule } from 'element-plus'
import { validateNameField, validateAddressField, formatName } from '@/composables/formatting'

// Interface for form data
interface FormData {
  id?: number
  firstName: string
  middleInitial: string
  lastName: string
  birthDate: string
  age: number
  address: string
  course: string
}

// Props for student ID and submit button text
const props = defineProps({
  studentId: {
    type: Number,
    default: null,
  },
  submitButtonText: {
    type: String,
    default: 'Submit',
  },
})

// Emits for form submission and cancel events
const emit = defineEmits(['submit-success', 'cancel'])

// Form reference and student store
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const studentStore = useStudentStore()

// Reactive form data
const formData = reactive<FormData>({
  firstName: '',
  middleInitial: '',
  lastName: '',
  birthDate: '',
  age: 0,
  address: '',
  course: '',
})

// Original form data for comparison for editing and reset
const originalFormData = ref<FormData>({} as FormData)

// Form validation rules
const rules: Record<string, FormItemRule[]> = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' },
    { min: 2, message: 'First name must be at least 2 characters', trigger: 'blur' },
    { max: 70, message: 'First name cannot exceed 70 characters', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value && !validateNameField(value)) {
        callback(new Error('First name can only contain letters'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  middleInitial: [
    { validator: (rule, value, callback) => {
      if (value && !validateNameField(value)) {
        callback(new Error('Middle initial can only contain letters'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur' },
    { min: 2, message: 'Last name must be at least 2 characters', trigger: 'blur' },
    { max: 70, message: 'Last name cannot exceed 70 characters', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value && !validateNameField(value)) {
        callback(new Error('Last name can only contain letters'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  birthDate: [{ required: true, message: 'Birth date is required', trigger: 'change' }],
  address: [
    { required: true, message: 'Address is required', trigger: 'blur' },
    { min: 5, message: 'Address must be at least 5 characters', trigger: 'blur' },
    { max: 500, message: 'Address cannot exceed 500 characters', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value && !validateAddressField(value)) {
        callback(new Error('Address cannot contain special characters'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  course: [{ required: true, message: 'Course is required', trigger: 'change' }],
  age: [
    {
      validator: (rule, value, callback) => {
        if (value < 16) {
          callback(new Error('Student must be at least 16 years old'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// Computed property for available courses
const availableCourses = computed(() => {
  return studentStore.availableCourses
})

// Calculate age based on birth date
const calculateAge = () => {
  // If there is a birth date, calculate age
  if (formData.birthDate) {
    const birthDate = new Date(formData.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()

    // If the current month is less than the birth month or if the current month is the same 
    // as the birth month but the current day is less than the birth day, decrement the age
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    // Set the age in the form data
    formData.age = age

    // Validate age field after DOM pdates, rechecks if age is valid after calculation
    // based on the rules defined (must be at least 16 years old)
    nextTick(() => {
      formRef.value?.validateField('age')
    })
  } else {
    formData.age = 0
  }
}

// Watch for changes in birth date to recalculate age
watch(
  () => formData.birthDate,
  () => {
    calculateAge()
  },
)

// Loads existing student data if editing
const loadStudentData = () => {
  if (props.studentId) {
    const student = studentStore.getStudentById(props.studentId)
    if (student) {
      // Explicitly assign each field to ensure proper data loading
      formData.firstName = student.firstName || ''
      formData.middleInitial = student.middleInitial || ''
      formData.lastName = student.lastName || ''
      formData.birthDate = student.birthDate || ''
      formData.age = student.age || 0
      formData.address = student.address || ''
      formData.course = student.course || ''
      
      // Also update the original form data for reset functionality
      Object.assign(originalFormData.value, {
        firstName: student.firstName || '',
        middleInitial: student.middleInitial || '',
        lastName: student.lastName || '',
        birthDate: student.birthDate || '',
        age: student.age || 0,
        address: student.address || '',
        course: student.course || ''
      })
    }
  }
}

// Load data on mount
onMounted(loadStudentData)

// Watch for changes in studentId to reload data
watch(
  () => props.studentId,
  (newId) => {
    if (newId) {
      loadStudentData()
    } else {
      // Reset form when switching from edit to add
      resetForm()
    }
  },
)

// Format name fields with proper capitalization
const formatFirstName = () => {
  if (formData.firstName) {
    formData.firstName = formatName(formData.firstName)
  }
}

const formatMiddleInitial = () => {
  if (formData.middleInitial) {
    formData.middleInitial = formatName(formData.middleInitial)
  }
}

const formatLastName = () => {
  if (formData.lastName) {
    formData.lastName = formatName(formData.lastName)
  }
}

// Disable future dates and dates before January 1, 1900
const disabledDates = (time: Date) => {
  const minDate = new Date('1949-12-31').getTime()
  const now = Date.now()
  return time.getTime() > now || time.getTime() < minDate
}

// Reset form to initial state
const resetForm = () => {
  // Reference to the form component, resets validation and restores original values
  if (formRef.value) {
    formRef.value.resetFields()
  }

  // First checks if it is in edit mode and if original form data is available
  if (props.studentId && Object.keys(originalFormData.value).length > 0) {
    // In edit mode, reset to original values
    // Type-safe approach to restore original form values
    formData.firstName = originalFormData.value.firstName || ''
    formData.middleInitial = originalFormData.value.middleInitial || ''
    formData.lastName = originalFormData.value.lastName || ''
    formData.birthDate = originalFormData.value.birthDate || ''
    formData.age = originalFormData.value.age || 0
    formData.address = originalFormData.value.address || ''
    formData.course = originalFormData.value.course || ''
  } else {
    // In add mode, reset to empty values with proper typing
    formData.firstName = ''
    formData.middleInitial = ''
    formData.lastName = ''
    formData.birthDate = ''
    formData.age = 0
    formData.address = ''
    formData.course = ''
  }
}

// Submit form after validation
const validateAndSubmit = () => {
  // No reference to the form component, return
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (valid) {
      // Construct the full name from form fields, used for searching
      const fullName = `${formData.firstName} ${formData.middleInitial ? formData.middleInitial + '. ' : ''}${formData.lastName}`.trim()
      
      if (props.studentId) {
        // Update existing student
        // Create a Student object with all required fields
        const existingStudent = studentStore.getStudentById(props.studentId)
        const studentData: Student = {
          id: props.studentId,
          firstName: formData.firstName,
          middleInitial: formData.middleInitial,
          lastName: formData.lastName,
          name: fullName,
          birthDate: formData.birthDate,
          age: formData.age,
          address: formData.address,
          course: formData.course,
          createdAt: existingStudent?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        studentStore.updateStudent(studentData)
      } else {
        // Add new student - Omit<Student, 'id' | 'createdAt' | 'updatedAt'>
        const studentData = {
          firstName: formData.firstName,
          middleInitial: formData.middleInitial,
          lastName: formData.lastName,
          name: fullName,
          birthDate: formData.birthDate,
          age: formData.age,
          address: formData.address,
          course: formData.course
        }
        studentStore.addStudent(studentData)
      }
      emit('submit-success')
      resetForm()
    } else {
      ElMessage({
        message: 'Please correct the errors in the form.',
        type: 'error',
      })
    }
  })
}
</script>

<style scoped>
.student-form {
  width: 100%;
  margin: 0 auto;
  padding: 0 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: lightgrey;
}

:deep(.el-date-editor.el-input) {
  width: 100% !important;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  min-height: 40px;
}

.birth-date:deep(.el-form-item__error){
  padding-top: 12px;
}

@media (max-width: 576px) {
  .student-form {
    padding: 0;
  }
  
  .form-actions {
    flex-direction: column !important;
    gap: 8px;
  }

  .form-actions .el-button {
    width: 100%;
    height: 44px;
    font-size: 16px;
    margin: 0;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    font-size: 16px;
    margin-bottom: 8px;
  }
}
</style>
