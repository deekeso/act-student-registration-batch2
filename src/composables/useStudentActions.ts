import { type Ref } from 'vue'
import type { Students } from '@/types/Students'

export function useStudentActions(students: Ref<Students[]>) {
  function handleEdit(student: Students) {
    console.log('Edit:', student)
  }

  function handleDelete(student: Students) {
    students.value = students.value.filter((s) => s !== student)
  }

  return {
    handleEdit,
    handleDelete,
  }
}
