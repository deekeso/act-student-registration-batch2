<!-- StudentList.vue -->
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Student } from '../interfaces/studentInterface'
import { Courses } from '@/constants/courses'
import { Avatar } from '@element-plus/icons-vue'

interface Props {
  students: Student[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editStudent: [student: Student, index: number]
  deleteStudent: [student: Student, index: number]
  hideStudents: []
}>()

const searchQuery = ref('')
const selectedCourseFilter = ref<string>('')
const ageFilter = ref('')
const showFilters = ref(false)

const longPressTimer = ref<number | null>(null)
const isLongPress = ref(false)
const selectedStudent = ref<Student | null>(null)
const selectedIndex = ref<number>(-1)

const filteredStudents = computed(() => {
  let filtered = [...props.students]

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
    const actualIndex = props.students.findIndex(
      (s) =>
        s.firstName === student.firstName &&
        s.lastName === student.lastName &&
        s.birthDay === student.birthDay,
    )
    emit('deleteStudent', student, actualIndex)
  }, 400)
}

function endLongPress() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
  setTimeout(() => {
    if (!isLongPress.value && selectedStudent.value && selectedIndex.value >= 0) {
      const actualIndex = props.students.findIndex(
        (s) =>
          s.firstName === selectedStudent.value!.firstName &&
          s.lastName === selectedStudent.value!.lastName &&
          s.birthDay === selectedStudent.value!.birthDay,
      )
      emit('editStudent', selectedStudent.value, actualIndex)
    }
  }, 270)
}

function handleHideStudents() {
  emit('hideStudents')
}
</script>

<template>
  <div class="student-list-container">
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

    <el-button class="hide-student-btn" type="primary" size="default" @click="handleHideStudents">
      <el-icon><Hide /></el-icon> Hide Students
    </el-button>
  </div>
</template>

<style lang="css" scoped>
.student-list-container {
  width: 100%;
  height: 100%;
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

.card-header {
  margin-bottom: 1rem;
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

/* Responsive styles */
@media (max-width: 768px) {
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

/* Scrollbar styling */
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
