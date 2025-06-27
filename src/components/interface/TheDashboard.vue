<template>
  <div class="dashboard-container">
    <TheHeader />
    <!-- Add Student Button -->
    <div class="add_Students">
      <div class="search-container">
        <SearchBar v-model="search" />
        <CourseSearchBar v-model="courseSearch" />
      </div>
      <div class="button-container">
        <AddButton @open="isAddDrawerOpen = true" />
        <el-dropdown @command="handleSort" trigger="click">
          <el-button color="#2148c0" :icon="Filter" class="filter-button" dark>
            Filter <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="lastName-asc">Last Name (A-Z)</el-dropdown-item>
              <el-dropdown-item command="lastName-desc">Last Name (Z-A)</el-dropdown-item>
              <el-dropdown-item command="added-desc">Newest Added </el-dropdown-item>
              <el-dropdown-item command="added-asc">Oldest Added </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
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

    <div class="table-container">
      <ReusableTable :data="filteredStudents" @edit="handleEdit" @delete="handleDelete" />
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
import SearchBar from '@/components/ui/SearchBar.vue'
import CourseSearchBar from '@/components/ui/CourseSearchBar.vue'
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
      student.course.toLowerCase().includes(courseSearch.value.toLowerCase()),
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
      // Handle sorting by order added (using array index)
      if (field === 'added') {
        const originalStudents = store.allStudents()
        const aIndex = originalStudents.findIndex((student) => student.id === a.id)
        const bIndex = originalStudents.findIndex((student) => student.id === b.id)

        if (direction === 'asc') {
          return aIndex - bIndex // Oldest first (original order)
        } else {
          return bIndex - aIndex // Newest first (reverse order)
        }
      }

      let aValue = a[field as keyof Student]
      let bValue = b[field as keyof Student]

      // Handle string comparison for lastName
      if (field === 'lastName') {
        aValue = String(aValue || '').toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      }

      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
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
})
</script>

<style scoped>
.dashboard-container {
  position: relative;
  height: 100vh;
  background-color: white;
}

.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw; /* responsive width based on viewport */
  max-width: 50vw;
  height: 85vh; /* keeps your original height */
  margin: 0px auto 0 auto; /* reduced top margin */
  box-sizing: border-box;
  bottom: 20px;
  position: relative;
}

.add_Students {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 0;
  padding: 0 2rem;
  gap: 3rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  background-color: #264eca;
  padding: 15px;
  border-radius: 10px;
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
  position: relative;
  z-index: 5;
  bottom: 5px;
  right: 12px;
}

.filter-button {
  /* background-color: #1a3a9a;
  border-color: #1a3a9a; */
  border-radius: 8px;
  font-weight: 500;
  max-width: 200px;
  position: relative;
  z-index: 10;
  height: 40px;
  width: 100px;
  border-radius: 10px;
}

/* .filter-button:hover {
  background-color: #264eca;
  border-color: #264eca;
} */

/* Responsive design */
@media (max-width: 768px) {
  .dashboard-container > *:not(:first-child) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .add_Students {
    flex-direction: column;
    gap: 2rem;
    padding: 0 1rem;
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
    bottom: 40px;
  }
}

@media (max-width: 480px) {
  .dashboard-container > *:not(:first-child) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
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
    /* width: 90vw; */
    max-width: none;
    padding: 0 1.5rem;
  }

  .filter-button {
    /* width: 90vw; */
    max-width: none;
    z-index: 10;
    position: relative;
  }

  .table-container {
    width: 98vw;
    max-width: none;
    z-index: 1;
    bottom: 15px;
  }
}
</style>
