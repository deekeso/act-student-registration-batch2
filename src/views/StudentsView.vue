<template>
  <div class="students-view">
    <div class="page-header">
      <h1 class="page-title">Student Records</h1>
      <el-button type="primary" @click="openAddStudentDrawer" :icon="Plus">
        Add New Student
      </el-button>
    </div>

    <el-card class="filter-section">
      <el-row :gutter="20" class="filter-row">
        <el-col :xs="24" :sm="8" class="filter-group">
          <el-form-item label="Filter by Course:">
            <el-select v-model="courseFilter" placeholder="All Courses" clearable fit-input-width>
              <el-option label="All Courses" value="" />
              <!-- Lists courses from the store -->
              <el-option
                v-for="course in availableCourses"
                :key="course"
                :label="course"
                :value="course"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="8" class="filter-group">
          <el-form-item label="Search:">
            <el-input v-model="searchQuery" placeholder="Search by name..." clearable>
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="8" class="filter-group">
          <el-form-item label="View Mode:">
            <el-radio-group fill="#67B8F9" v-model="viewMode" size="large">
              <el-radio-button label="cards" title="Cards View">
                <el-icon><Grid /></el-icon> Cards
              </el-radio-button>
              <el-radio-button label="table" title="Table View">
                <el-icon><List /></el-icon> Table
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <el-empty
      v-if="filteredStudents.length === 0"
      description="No Students Found"
      class="empty-state"
    >
      <template #description>
        <p>
          There are no students matching your current filters or no students have been registered yet.
        </p>
      </template>
      <el-button type="primary" @click="openAddStudentDrawer">Register a Student</el-button>
    </el-empty>

    <!-- Cards View -->
    <el-row
      v-if="viewMode === 'cards' && filteredStudents.length > 0"
      :gutter="20"
      class="students-grid"
    >
      <el-col
        v-for="student in filteredStudents"
        :key="student.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="student-card-col"
      >
        <student-card
          :student="student"
          @edit="openEditStudentDrawer"
          @delete="openDeleteConfirmation"
        />
      </el-col>
    </el-row>

    <!-- Table View -->
    <el-card v-if="viewMode === 'table' && filteredStudents.length > 0" class="table-container">
      <el-table :data="filteredStudents" style="width: 100%" border>
        <el-table-column label="Name">
          <template #default="{ row }">
            {{ row.firstName }}
            {{ row.middleInitial ? row.middleInitial + '.' : '' }}
            {{ row.lastName }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="Age" width="80" />
        <el-table-column prop="course" label="Course" />
        <el-table-column label="Actions" width="150" align="center">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                size="small"
                @click="openEditStudentDrawer(row.id)"
                title="Edit"
                :icon="Edit"
              />
              <el-button
                type="danger"
                size="small"
                @click="openDeleteConfirmation(row.id)"
                title="Delete"
                :icon="Delete"
              />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Student Drawer (Add/Edit) -->
    <student-drawer
      :is-open="isDrawerOpen"
      :student-id="selectedStudentId"
      @close="closeDrawer"
      @student-saved="handleStudentSaved"
    />

    <!-- Confirmation Modal -->
    <confirmation-modal
      :show="showDeleteConfirmation"
      title="Delete Student"
      message="Are you sure you want to delete this student record? This action cannot be undone."
      confirm-button-text="Delete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStudentStore } from '@/stores/student'
import StudentCard from '@/components/StudentCard.vue'
import StudentDrawer from '@/components/StudentDrawer.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { Plus, Search, Grid, List, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const studentStore = useStudentStore()

// State
const courseFilter = ref('')
const searchQuery = ref('')
const viewMode = ref('cards')
const isDrawerOpen = ref(false)
const selectedStudentId = ref<number | undefined>(undefined)
const showDeleteConfirmation = ref(false)
const studentToDelete = ref<number | null>(null)

// Computed properties
const availableCourses = computed(() => studentStore.availableCourses)
const students = computed(() => studentStore.students)

const filteredStudents = computed(() => {
  let result = [...students.value]

  // Filter by course
  if (courseFilter.value) {
    result = result.filter((student) => student.course === courseFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((student) => {
      const fullName = `${student.name}`.toLowerCase()
      return fullName.includes(query)
    })
  }

  return result
})

// Watch for changes in the search query
watch(searchQuery, (newValue, oldValue) => {
  console.log(`Search query changed from "${oldValue}" to "${newValue}"`)
})

// Methods
const openAddStudentDrawer = () => {
  selectedStudentId.value = undefined
  isDrawerOpen.value = true
}

const openEditStudentDrawer = (studentId: number) => {
  selectedStudentId.value = studentId
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const handleStudentSaved = () => {
  ElMessage({
    message: 'Student saved successfully!',
    type: 'success',
  })
}

const openDeleteConfirmation = (studentId: number) => {
  studentToDelete.value = studentId
  showDeleteConfirmation.value = true
}

const confirmDelete = () => {
  if (studentToDelete.value) {
    studentStore.deleteStudent(studentToDelete.value)
    showDeleteConfirmation.value = false
    studentToDelete.value = null
    ElMessage({
      message: 'Student deleted successfully!',
      type: 'success',
    })
  }
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
  studentToDelete.value = null
}
</script>

<style scoped>
.students-view {
  padding: 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-section {
  margin-bottom: 1.5rem;
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

.filter-row {
  display: flex;
  align-items: flex-end;
}

.filter-group {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: bold;
  font-size: 0.875rem;
  color: black;
  height: auto;
  position: relative;
}

/* Start of test edits */

:deep(.filter-group:last-child .el-form-item) {
  display: flex;
  align-items: center;
}

:deep(.filter-group:last-child .el-form-item__label) {
  margin-bottom: 0;
  padding-top: 0;
  line-height: 32px;
}

/* :deep(.filter-group:last-child .el-form-item__content) {
  margin-left: 0 !important;
  flex-grow: 0;
} */

/* :deep(.el-radio-group) {
  white-space: nowrap;
  display: inline-flex;
} */

/* End of test edits */

:deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #67B8F9;
}

.students-grid {
  margin-bottom: 1.5rem;
}

.student-card-col {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 1.5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-light);
  font-weight: bold;
}

:deep(.el-table__row:hover) {
  background-color: var(--el-fill-color-lighter);
}

.empty-state {
  padding: 3rem;
  margin-bottom: 1.5rem;
}

:deep(.el-empty__description p) {
  margin: 10px 0 20px;
  color: white;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-header .el-button {
    width: 100%;
  }

  :deep(.el-table) {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
