<template>
  <section>
    <div class="add_bsitStudents">
      <h1 class="course_title">BSIT Students</h1>
      <AddButton @open="isDrawerOpen = true" />
      <AddDrawer
        v-model="isDrawerOpen"
        title="Add Student"
        :initial-data="form"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
    <ReusableTable :data="store.allStudents()" @edit="handleEdit" @delete="handleDelete" />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ReusableTable from '/src/components/ui/ReusableTable.vue'

import type { Student } from '/src/types/Students.ts'
//import { students as studentList, students } from '/src/constants/index.ts'

import AddButton from '/src/components/ui/buttons/AddButton.vue'
import AddDrawer from '/src/components/ui/drawer/AddDrawer.vue'

import { useStudentActions } from '/src/composables/useStudentActions.ts'
import { useStudentForm } from '/src/composables/useStudentForm.ts'
import { useStudentStore } from '/src/stores/studentsStore.ts'

const store = useStudentStore()
const isDrawerOpen = ref(false)
const { form } = useStudentForm()

//const students = ref<Student[]>(studentList)

const { handleEdit, handleDelete, handleCancel } = useStudentActions()

const handleSubmit = async (data: Student) => {
  try {
    if (isEditing && isEditing.value) {
      await handleUpdate()
      console.log('Updated Student:', data)
    } else {
      store.addStudent({ ...data, course: data.course })
      console.log('Added Student:', data)
    }
    isDrawerOpen.value = false
  } catch (error) {
    console.error('Error in handleSubmit:', error)
  }
}

onMounted(() => {
  console.log('Store Students:', store.allStudents())
})
</script>

<style scoped>
.add_bsitStudents {
  display: flex;
  justify-content: space-between;
}

.course_title {
  font-weight: bold;
  color: whitesmoke;
}
</style>
