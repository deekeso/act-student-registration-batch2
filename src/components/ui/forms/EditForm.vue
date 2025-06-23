<template>
  <div>
    <el-form @submit.prevent :model="state" :rules="rules" ref="formRef" @validate="handleValidate">
      <el-card>
        <!-- Hidden input for id -->
        <!-- <el-input v-model="state.id" /> -->
        <div>
          <el-form-item label="Last Name" prop="lastName" required>
            <el-input
              id="lastName"
              type="text"
              v-model="state.lastName"
              style="width: 100%"
              placeholder="ex. Dela Cruz"
            />
          </el-form-item>
          <el-form-item label="First Name" prop="firstName" required>
            <el-input
              id="firstName"
              type="text"
              v-model="state.firstName"
              style="width: 100%"
              placeholder="ex. Juan"
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
              />
            </el-form-item>
            <el-form-item label="Birthday">
              <el-input
                id="birthDate"
                type="date"
                v-model="state.birthDate"
                style="width: 100%"
                placeholder=""
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
          <el-form-item label="Address">
            <el-input
              id="address"
              type="text"
              v-model="state.address"
              style="width: 100%"
              placeholder="Blk., No., Street, City, Province"
            />
          </el-form-item>
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
import type { Students } from '@/types/Students'
import { courses } from '@/constants/index.ts'

const emit = defineEmits<{
  (e: 'submit', data: Students): void
  (e: 'cancel'): void
  (e: 'delete', data: Students): void
}>()

const formRef = ref<FormInstance | null>(null)
//const formRef = ref(null)
const { state, rules, submitForm, resetForm, editingStudent } = useStudentActions(formRef)

onMounted(() => {
  console.log('onMounted: formRef.value =', formRef.value)
})

watch(formRef, (newVal) => {
  console.log('formRef changed:', newVal)
})

const handleValidate = (prop: string, isValid: boolean, error: unknown) => {
  if (!isValid) {
    console.log(`Validation failed for ${prop}:`, error)
  }
}

const handleSubmit = async () => {
  try {
    const result = await submitForm()
    if (result.success && result.data) {
      emit('submit', result.data)
    } else {
      console.error('Form submission failed:', result)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const handleDelete = () => {
  if (editingStudent.value) {
    emit('delete', { ...editingStudent.value })
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
