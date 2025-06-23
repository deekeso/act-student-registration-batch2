<template>
  <section>
    <div class="add_Students">
      <AddButton @open="isAddDrawerOpen = true" />
      <AddDrawer
        v-model="isAddDrawerOpen"
        title="Add Student"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
      <el-button @click="store.resetStudents">Reset Students</el-button>
      <EditDrawer
        v-model="isEditDrawerOpen"
        title="Edit Student"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @delete="handleDelete"
      />
    </div>
    <ReusableTable :data="store.allStudents()" @edit="handleEdit" @delete="handleDelete" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ReusableTable from '@/components/ui/ReusableTable.vue'
import type { Students } from '@/types/Students'
//import type { Student } from '@/types/Students.ts'

import AddButton from '@/components/ui/buttons/AddButton.vue'
import AddDrawer from '@/components/ui/drawer/AddDrawer.vue'
import EditDrawer from '@/components/ui/drawer/EditDrawer.vue'

//import { useStudentActions } from '/src/composables/useStudentActions.ts'
import { useStudentStore } from '@/stores/studentsStore.ts'

const store = useStudentStore()
const isAddDrawerOpen = ref(false)

// To get all students:
const isEditDrawerOpen = ref(false)
const editingStudent = ref<Students | null>(null)

const handleEdit = (student: Students) => {
  editingStudent.value = student
  isEditDrawerOpen.value = true
}

const handleDelete = (student: Students) => {
  store.deleteStudent(student)
}

const handleCancel = () => {
  isEditDrawerOpen.value = false
  editingStudent.value = null
}

const handleSubmit = (data: Students) => {
  if (editingStudent.value) {
    // Update student
    store.updateStudent({ ...data, id: editingStudent.value.id })
    isEditDrawerOpen.value = false
    editingStudent.value = null
  } else {
    // Add student
    store.addStudent({ ...data, age: Number(data.age) })
    isAddDrawerOpen.value = false
  }
}
// const { handleEdit, handleDelete, handleCancel, handleUpdate, isEditDrawerOpen, editingStudent } =
//   useStudentActions()

// const handleSubmit = async (data: Student) => {
//   console.log(data)
//   try {
//     if (editingStudent.value) {
//       await handleUpdate()
//       console.log('Updated Student:', data)
//     } else {
//       store.addStudent({ ...data, age: Number(data.age) })
//       console.log('Added Student:', data)
//       isAddDrawerOpen.value = false
//     }
//   } catch (error) {
//     console.error('Error in handleSubmit:', error)
//   }
// }

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
