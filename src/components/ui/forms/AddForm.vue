<template>
  <div>
    <el-form :model="state" :rules="rules" ref="formRef">
      <el-card>
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
                v-model="state.age"
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
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useStudentForm } from '@/composables/useStudentForm'
import type { Students } from '@/types/Students'
import { courses } from '/src/constants/index.ts'

const props = defineProps<{
  initialData?: Partial<Students>
}>()

const emit = defineEmits<{
  (e: 'submit', data: Students): void
  (e: 'cancel'): void
}>()

const { state, formRef, rules, submit, resetForm } = useStudentForm(props.initialData)

// Handle form submission
const handleSubmit = async () => {
  const result = await submit()
  if (result.success && result.data) {
    emit('submit', result.data)
    console.log(result.data)
  }
}

// Handle form cancellation
const handleCancel = () => {
  resetForm()
  emit('cancel')
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
