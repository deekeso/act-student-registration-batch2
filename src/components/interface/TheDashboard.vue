<template>
  <section>
    <!-- Add Student Button -->
    <div class="add_Students">
      <AddButton @open="isAddDrawerOpen = true" />
      <!-- Drawer for Adding a Student -->
      <AddDrawer
        v-model="isAddDrawerOpen"
        title="Add Student"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
      <!-- Reset Students Button -->
      <el-button @click="store.resetStudents">Reset Students</el-button>
      <!-- Drawer for Editing a Student -->
      <EditDrawer
        v-model="isEditDrawerOpen"
        title="Edit Student"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @delete="handleDelete"
      />
    </div>
    <!-- Table displaying all students -->
    <ReusableTable :data="store.allStudents()" @edit="handleEdit" @delete="handleDelete" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ReusableTable from '@/components/ui/ReusableTable.vue'
import type { Student } from '@/types/Students'

import AddButton from '@/components/ui/buttons/AddButton.vue'
import AddDrawer from '@/components/ui/drawer/AddDrawer.vue'
import EditDrawer from '@/components/ui/drawer/EditDrawer.vue'

import { useStudentStore } from '@/stores/studentsStore.ts'

const store = useStudentStore() // Pinia store instance for students
const isAddDrawerOpen = ref(false) // Add drawer visibility state
const isEditDrawerOpen = ref(false) // Edit drawer visibility state
const editingStudent = ref<Student | null>(null) // Holds the student currently being edited

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
.add_Students {
  display: flex;
  justify-content: space-between;
}

.course_title {
  font-weight: bold;
  color: whitesmoke;
}
</style>
