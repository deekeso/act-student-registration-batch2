<template>
  <div class="dashboard-container">
    <TheHeader />
    <!-- Add Student Button -->
    <div class="add_Students">
      <SearchBar v-model="search" />
      <AddButton @open="isAddDrawerOpen = true" />
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
    <ReusableTable :data="filteredStudents" @edit="handleEdit" @delete="handleDelete" />
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

import { useStudentStore } from '@/stores/studentsStore.ts'
import TheHeader from '@/components/ui/TheHeader.vue'

const store = useStudentStore() // Pinia store instance for students
const isAddDrawerOpen = ref(false) // Add drawer visibility state
const isEditDrawerOpen = ref(false) // Edit drawer visibility state
const editingStudent = ref<Student | null>(null) // Holds the student currently being edited
const search = ref('')

// Computed property to filter students based on search input
const filteredStudents = computed(() => {
  return store
    .allStudents()
    .filter((student) =>
      Object.values(student).some((val) =>
        String(val).toLowerCase().includes(search.value.toLowerCase()),
      ),
    )
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

// On mount, log all students (for debugging)
onMounted(() => {
  console.log('All Students:', store.allStudents())
})
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  background-color: white;
}

.add_Students {
  display: flex;
  justify-content: center;
  margin: 0;
  align-items: center;
  padding: 0 2rem;
  gap: 5rem;
}

.course_title {
  font-weight: bold;
  color: whitesmoke;
}
</style>
