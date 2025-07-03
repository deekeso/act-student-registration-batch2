<script lang="ts" setup>
import { ref, onMounted, computed, readonly } from 'vue'
import { useStudentStore } from '@/stores/StudentStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseHeader from '@/components/BaseHeader.vue'
import RegisterDrawer from '@/components/RegisterDrawer.vue'
import EditDrawer from '@/components/EditDrawer.vue'
import type { Student } from '../types/studentInterface'
import { Courses } from '@/constants/courses'
import { Avatar } from '@element-plus/icons-vue'

const emit = defineEmits<{
  studentRegistered: [student: Student]
  studentUpdated: [student: Student, index: number]
  studentDeleted: [index: number]
  viewModeChanged: [showCards: boolean]
  formValidationError: [errors: string[]]
  operationSuccess: [message: string]
  operationError: [message: string]
}>()

const searchQuery = ref('')
const selectedCourseFilter = ref<string>('')
const ageFilter = ref('')
const showFilters = ref(false)
const showStudentCard = ref(false)

const drawerRegister = ref(false)
const drawerEdit = ref(false)

const studentStore = useStudentStore()
const students = computed(() => studentStore.students)
const loadStudents = studentStore.loadStudents

const longPressTimer = ref<number | null>(null)
const isLongPress = ref(false)
const selectedStudent = ref<Student | null>(null)
const selectedIndex = ref<number>(-1)

const editStudentData = ref<Student | null>(null)
const editStudentIndex = ref(-1)

const filteredStudents = computed(() => {
  let filtered = [...studentStore.students]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((student) => {
      const fullName =
        `${student.firstName} ${student.middleInitial} ${student.lastName}`.toLowerCase()
      const address = student.address.toLowerCase()
      return fullName.includes(query) || address.includes(query)
    })
  }

  if (selectedCourseFilter.value) {
    filtered = filtered.filter((student) =>
      student.courses.some((course) => course === selectedCourseFilter.value),
    )
  }

  if (ageFilter.value) {
    const [min, max] = ageFilter.value.split('-').map(Number)
    filtered = filtered.filter((student) => student.age >= min && student.age <= max)
  }

  return filtered
})

function startLongPress(student: Student, index: number) {
  isLongPress.value = false
  selectedStudent.value = student
  selectedIndex.value = index
  longPressTimer.value = setTimeout(() => {
    isLongPress.value = true
    ElMessageBox.confirm(
      `Are you sure you want to delete ${student.firstName} ${student.middleInitial} ${student.lastName}`,
      'Delete Student?',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )
      .then(() => {
        deleteStudent(index)
      })
      .catch(() => {
        ElMessage.info('Delete Cancelled')
        emit('operationError', 'Delete operation cancelled')
      })
  }, 400)
}

function endLongPress() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  setTimeout(() => {
    if (!isLongPress.value && selectedStudent.value && selectedIndex.value >= 0) {
      editStudent(selectedStudent.value, selectedIndex.value)
    }
  }, 270)
}

function editStudent(student: Student, index: number) {
  try {
    editStudentData.value = student
    editStudentIndex.value = index
    drawerEdit.value = true
  } catch (error) {
    ElMessage.error('Something went wrong')
    emit('operationError', 'Failed to open edit form')
    console.error(error)
  }
}

function deleteStudent(index: number) {
  const deletedStudent = studentStore.students[index]
  studentStore.students.splice(index, 1)

  localStorage.setItem('students', JSON.stringify(studentStore.students))
  ElMessage.success('Deletion successful')

  emit('studentDeleted', index)
  emit(
    'operationSuccess',
    `Student ${deletedStudent.firstName} ${deletedStudent.lastName} deleted successfully`,
  )
}

function handleStudentRegistered(student: Student) {
  drawerRegister.value = false
  emit('studentRegistered', student)
}

function handleStudentUpdated(student: Student, index: number) {
  drawerEdit.value = false
  editStudentIndex.value = -1
  editStudentData.value = null
  emit('studentUpdated', student, index)
}

function handleRegistrationSuccess(message: string) {
  emit('operationSuccess', message)
}

function handleRegistrationError(message: string) {
  emit('operationError', message)
}

function handleFormValidationError(errors: string[]) {
  emit('formValidationError', errors)
}

function toggleViewMode() {
  showStudentCard.value = !showStudentCard.value
  emit('viewModeChanged', showStudentCard.value)
}

function openRegistration() {
  drawerRegister.value = true
}

onMounted(() => {
  loadStudents()
})

defineExpose({
  toggleViewMode,
  openRegistration,
  showStudentCard: readonly(showStudentCard),
})
</script>

<template>
  <BaseHeader />
  <div class="page-body">
    <!-- Dashboard Cards -->
    <div v-if="!showStudentCard" class="dashboard-cards">
      <el-card class="action-card" shadow="hover">
        <div class="card-header">
          <span class="card-title">
            <el-icon><UserFilled /></el-icon>
            Register a Student
          </span>
        </div>
        <div class="card-body">
          <p class="card-description">
            Add new students to the system with their personal information and course selections.
          </p>
          <el-button type="primary" class="action-btn" @click="drawerRegister = true">
            <el-icon><Plus /></el-icon>
            Open Registration
          </el-button>
        </div>
      </el-card>

      <el-card class="action-card" shadow="hover">
        <div class="card-header">
          <span class="card-title">
            <el-icon><Grid /></el-icon>
            Display Students
          </span>
        </div>
        <div class="card-body">
          <p class="card-description">
            View all registered students in an organized card layout with their details.
          </p>
          <el-button type="success" class="action-btn" @click="showStudentCard = !showStudentCard">
            <el-icon><View /></el-icon>
            Show Students
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- Student List View -->
    <template v-if="showStudentCard">
      <div class="search-container">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="Search students by name or address..."
            prefix-icon="Search"
            clearable
            class="search-input"
          />
          <el-button
            icon="Filter"
            @click="showFilters = !showFilters"
            :type="showFilters ? 'primary' : 'default'"
          >
            Filters
          </el-button>
        </div>

        <el-collapse-transition>
          <div v-show="showFilters" class="filter-row">
            <el-select
              v-model="selectedCourseFilter"
              placeholder="Filter by course"
              clearable
              class="filter-select"
              fit-input-width
            >
              <el-option v-for="course in Courses" :key="course" :label="course" :value="course" />
            </el-select>

            <el-select
              v-model="ageFilter"
              placeholder="Filter by age range"
              clearable
              class="filter-select"
            >
              <el-option label="18-25" value="18-25" />
              <el-option label="26-35" value="26-35" />
              <el-option label="36-50" value="36-50" />
              <el-option label="50+" value="50-100" />
            </el-select>
          </div>
        </el-collapse-transition>

        <div class="instructions-banner">
          <div class="instruction-item">
            <el-icon class="instruction-icon"><EditPen /></el-icon>
            <span>Tap a card to edit student</span>
          </div>
          <div class="instruction-item">
            <el-icon class="instruction-icon"><Delete /></el-icon>
            <span>Press and hold a card to delete</span>
          </div>
        </div>
      </div>

      <div class="card-container">
        <div v-if="students.length === 0" class="no-students">
          <el-empty class="empty-desc" description="No students available" />
        </div>
        <div v-else-if="filteredStudents.length === 0" class="no-students">
          <el-empty class="empty-desc" description="No student found" />
        </div>

        <el-card
          v-for="(student, index) in filteredStudents"
          :key="index"
          class="student-card"
          shadow="hover"
          @mousedown="startLongPress(student, index)"
          @mouseup="endLongPress"
          @touchstart="startLongPress(student, index)"
          @touchend="endLongPress"
        >
          <template #header>
            <div class="card-header">
              <span class="student-name" style="font-weight: bold">
                <el-icon><Avatar /></el-icon>
                {{ student.firstName }} {{ student.middleInitial }} {{ student.lastName }}
              </span>
            </div>
          </template>

          <div class="student-info">
            <p class="info-item">
              <el-icon><Calendar /></el-icon> <strong> Age:</strong> {{ student.age }} |
              <strong>Birthday:</strong> {{ student.birthDay }}
            </p>

            <p class="info-item">
              <el-icon><Location /></el-icon><strong> Address:</strong> {{ student.address }}
            </p>
            <p class="info-item">
              <el-icon><School /></el-icon>
              <strong> Courses: </strong>
              <span v-for="(course, index) in student.courses" :key="course">
                {{ course }}<span v-if="index < student.courses.length - 1">, </span>
              </span>
            </p>
          </div>
        </el-card>
      </div>

      <el-button
        class="hide-student-btn"
        type="primary"
        size="default"
        @click="showStudentCard = false"
      >
        <el-icon><Hide /></el-icon> Hide Student
      </el-button>
    </template>
  </div>

  <RegisterDrawer
    v-model="drawerRegister"
    @student-registered="handleStudentRegistered"
    @form-validation-error="handleFormValidationError"
    @operation-success="handleRegistrationSuccess"
    @operation-error="handleRegistrationError"
  />

  <EditDrawer
    v-model="drawerEdit"
    :student="editStudentData"
    :student-index="editStudentIndex"
    @student-updated="handleStudentUpdated"
    @operation-success="handleRegistrationSuccess"
    @operation-error="handleRegistrationError"
  />
</template>

<style lang="css" scoped>
.page-body {
  min-height: 100vh;
  background: #020024;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 15%,
    rgba(9, 9, 121, 1) 66%,
    rgba(0, 212, 255, 1) 100%
  );
  padding: 1rem;
}

.dashboard-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  justify-content: center;
  margin: 100px auto;
  padding: 1rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  margin-top: 20px;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: none;
}

.action-card:hover {
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.action-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b5b95);
}

.search-container {
  max-width: 1200px;
  margin: 60px auto;
  padding: 1rem;
}

.search-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
}

.filter-row {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  margin-bottom: 1rem;
}

.filter-select {
  min-width: 150px;
}

.instructions-banner {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
}

.instruction-icon {
  font-size: 1rem;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  max-height: 70vh;
  overflow-y: auto;
}

.student-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.student-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.student-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
}

.info-item strong {
  color: #2d3748;
}

.hide-student-btn {
  display: block;
  margin: 1rem auto;
  width: 200px;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hide-student-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b5b95);
}

.no-students {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
}

.empty-desc {
  color: #718096;
}

@media (max-width: 768px) {
  .page-body {
    padding: 0.5rem;
  }

  .dashboard-cards {
    gap: 1rem;
    padding: 0.5rem;
  }

  .action-card {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .search-bar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-select {
    min-width: 100%;
  }

  .instructions-banner {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .instruction-item {
    justify-content: center;
    font-size: 0.8rem;
  }

  .card-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.5rem;
    max-height: 60vh;
  }

  .student-card {
    padding: 1.25rem;
  }

  .student-name {
    font-size: 1rem;
  }

  .info-item {
    font-size: 0.8rem;
  }

  .hide-student-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .dashboard-cards {
    padding: 0.25rem;
  }

  .action-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.875rem;
  }

  .action-btn {
    height: 44px;
    font-size: 0.875rem;
  }

  .search-container {
    padding: 0.5rem;
  }

  .filter-row {
    padding: 0.75rem;
  }

  .instructions-banner {
    padding: 0.5rem;
  }

  .instruction-item {
    font-size: 0.75rem;
  }

  .card-container {
    padding: 0.25rem;
    max-height: 55vh;
  }

  .student-card {
    padding: 1rem;
  }

  .student-name {
    font-size: 0.9rem;
  }

  .info-item {
    font-size: 0.75rem;
  }

  .hide-student-btn {
    height: 44px;
    font-size: 0.875rem;
  }
}

@media (max-width: 360px) {
  .action-card {
    padding: 0.75rem;
  }

  .card-title {
    font-size: 0.9rem;
  }

  .action-btn {
    height: 40px;
    font-size: 0.8rem;
  }

  .student-card {
    padding: 0.75rem;
  }

  .student-name {
    font-size: 0.85rem;
  }

  .info-item {
    font-size: 0.7rem;
  }

  .hide-student-btn {
    height: 40px;
    font-size: 0.8rem;
  }
}

.card-container {
  scroll-behavior: smooth;
}

.card-container::-webkit-scrollbar {
  width: 6px;
}

.card-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.card-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.card-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
