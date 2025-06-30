<template>
  <div class="header"><TheHeader /></div>
  <div class="dashboard-container">
    <!-- Drawer for Adding a Student -->
    <AddDrawer
      v-model="isAddDrawerOpen"
      title="Add Student"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <!-- Reset Students Button -->
    <!-- <el-button @click="store.resetStudents">Reset Students</el-button> -->
    <!-- Drawer for Editing a Student -->
    <EditDrawer
      v-model="isEditDrawerOpen"
      title="Edit Student"
      :editing-student="editingStudent"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @delete="handleDelete"
    />
    <!-- Table displaying all students -->
    <!-- Add Student Button -->

    <div class="parent">
      <div class="div1">
        <SearchBar v-model="search" />
        <CourseSearchBar v-model="courseSearch" />

        <div class="button-row">
          <el-dropdown @command="handleSort" trigger="click">
            <el-button color="#2148c0" :icon="Filter" class="filter-button" dark>
              Filter <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="lastName-asc">Last Name (A-Z)</el-dropdown-item>
                <el-dropdown-item command="lastName-desc">Last Name (Z-A)</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <AddButton @open="isAddDrawerOpen = true" style="height: 40px; width: 100px" />
        </div>
      </div>
      <div class="div3">
        <ReusableTable :data="filteredStudents" @edit="handleEdit" @delete="handleDelete" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import ReusableTable from '@/components/ui/ReusableTable.vue'
import type { Student } from '@/types/Students'

import AddButton from '@/components/ui/buttons/AddButton.vue'
import AddDrawer from '@/components/ui/drawer/AddDrawer.vue'
import EditDrawer from '@/components/ui/drawer/EditDrawer.vue'
import SearchBar from '@/components/ui/search/SearchBar.vue'
import CourseSearchBar from '@/components/ui/search/CourseSearchBar.vue'
import { Filter, ArrowDown } from '@element-plus/icons-vue'

import { useStudentStore } from '@/stores/studentsStore.ts'
import TheHeader from '@/components/ui/TheHeader.vue'

const store = useStudentStore() // Pinia store instance for students
const isAddDrawerOpen = ref(false) // Add drawer visibility state
const isEditDrawerOpen = ref(false) // Edit drawer visibility state
const editingStudent = ref<Student | null>(null) // Holds the student currently being edited
const search = ref('')
const courseSearch = ref('')
const currentSort = ref('')

// Computed property to filter students based on search input
const filteredStudents = computed(() => {
  let students = store.allStudents()

  // Filter by course if course search is active
  if (courseSearch.value) {
    students = students.filter((student) =>
      student.course?.toLowerCase().includes(courseSearch.value.toLowerCase()),
    )
  }

  // Filter by name/address if search is active
  if (search.value) {
    students = students.filter((student) =>
      Object.values(student).some((val) =>
        String(val).toLowerCase().includes(search.value.toLowerCase()),
      ),
    )
  }

  // Sort students if sorting is active
  if (currentSort.value) {
    const [field, direction] = currentSort.value.split('-')
    students.sort((a, b) => {
      let aValue = a[field as keyof Student]
      let bValue = b[field as keyof Student]

      // Handle string comparison for lastName
      if (field === 'lastName') {
        aValue = String(aValue || '').toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      }

      if (direction === 'asc') {
        return aValue && bValue ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : 0
      } else {
        return aValue && bValue ? (aValue > bValue ? -1 : aValue < bValue ? 1 : 0) : 0
      }
    })
  }

  return students
})

// Called when user clicks "Edit" in the table
const handleEdit = (student: Student) => {
  editingStudent.value = student
  isEditDrawerOpen.value = true
}
// Called when user clicks "Delete" in the table or drawer
const handleDelete = (student: Student) => {
  store.deleteStudent(student)
}

// Called when user cancels add/edit drawer
const handleCancel = () => {
  isEditDrawerOpen.value = false
  editingStudent.value = null
}

// Called when user submits add/edit form
const handleSubmit = (data: Student) => {
  if (editingStudent.value) {
    // Update student
    store.updateStudent({ ...data, id: editingStudent.value.id })
    isEditDrawerOpen.value = false // Close edit drawer
    editingStudent.value = null // Reset editing student
  } else {
    // Add student
    store.addStudent({ ...data, age: Number(data.age) })
    isAddDrawerOpen.value = false // Close add drawer
  }
}

const handleSort = (command: string) => {
  currentSort.value = command
}

// On mount, log all students (for debugging)
onMounted(() => {
  console.log('All Students:', store.allStudents())

  // Initialize students table if it's empty (first time login)
  if (store.allStudents().length === 0) {
    console.log('Initializing students table with initial data...')
    store.resetStudents()
  }
})
</script>

<style scoped>
.header {
  width: 100%;
  height: fit-content;
  top: 0;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80vw;
  min-height: 100vh;
  padding-top: 2rem;
  padding-bottom: 2rem;
  background-color: white;
}

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  width: 80vw;
  box-sizing: border-box;
  position: relative;
}

.add_Students {
  display: flex;
  align-items: center;
  gap: 3rem;
  width: 100px;
}

.course_title {
  font-weight: bold;
  color: whitesmoke;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  z-index: 5;
  bottom: 5px;
}

.search-container {
  margin: 15px;
}

.filter-button {
  border-radius: 8px;
  height: 40px;
  font-weight: 500;
  max-width: 200px;
  z-index: 10;
  border-radius: 10px;
  border: 1px solid #fff;
}

.parent {
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.div1 {
  display: flex;
  min-width: 50vw;
  gap: 1rem;
  align-items: center;
  background-color: #264eca;
  border-radius: 10px;
  padding: 12px;
}

.div3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .dashboard-container > *:not(:first-child) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .div1 {
    flex-direction: column;
  }

  .search-container {
    width: 100%;
  }

  .button-container {
    width: 100%;
    gap: 1rem;
    display: flex;
    flex-direction: row;
    padding: 0 1rem;
    left: 1px;
  }

  .add_Students :deep(.el-button) {
    width: 100%;
    height: 40px;
    max-width: none;
  }

  .filter-button {
    width: 100%;
    max-width: none;
    z-index: 10;
    position: relative;
  }

  .table-container {
    width: 95vw;
    max-width: none;
    z-index: 1;
    bottom: 80px;
  }
}

@media (max-width: 480px) {
  .dashboard-container > *:not(:first-child) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .div1 {
    flex-direction: column;
    padding: 2rem 0px;
  }

  .add_Students {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  .button-container {
    width: 100%;
    gap: 0.8rem;
    z-index: 5;
  }

  .add_Students :deep(.el-button) {
    max-width: none;
    padding: 0 1.5rem;
    height: 40px;
  }

  .filter-button {
    max-width: none;
    z-index: 10;
    position: relative;
  }

  .table-container {
    width: 98vw;
    max-width: none;
    z-index: 1000;
    bottom: 25px;
  }
}

.button-row {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
