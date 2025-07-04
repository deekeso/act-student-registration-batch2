import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Student } from '@/interfaces/studentInterface'

export const useStudentStore = defineStore('students', () => {
  const studentInfo = ref<Student>({
    firstName: '',
    middleInitial: '',
    lastName: '',
    birthDay: '',
    age: 0,
    address: '',
    courses: [],
  })

  const students = ref<Student[]>([])

  function addStudent() {
    students.value.push({ ...studentInfo.value })
    saveToStorage()
    resetStudentInfo()
    ElMessage.success('Student registered successfully!')
  }

  function updateStudent(index: number, updatedStudent: Student) {
    if (index >= 0 && index < students.value.length) {
      students.value[index] = updatedStudent
      saveToStorage()
      ElMessage.success('Student updated successfully!')
    }
  }

  function deleteStudent(index: number) {
    if (index >= 0 && index < students.value.length) {
      const deletedStudent = students.value[index]
      students.value.splice(index, 1)
      saveToStorage()
      ElMessage.success(
        `Student ${deletedStudent.firstName} ${deletedStudent.lastName} deleted successfully!`,
      )
    }
  }

  function confirmDeleteStudent(student: Student, index: number) {
    return ElMessageBox.confirm(
      `Are you sure you want to delete ${student.firstName} ${student.middleInitial} ${student.lastName}?`,
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
        ElMessage.info('Delete cancelled')
      })
  }

  function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students.value))
  }

  function resetStudentInfo() {
    studentInfo.value = {
      firstName: '',
      middleInitial: '',
      lastName: '',
      birthDay: '',
      age: 0,
      address: '',
      courses: [],
    }
  }

  function loadStudents() {
    const saved = localStorage.getItem('students')
    if (saved) {
      students.value = JSON.parse(saved)
    }
  }

  return {
    studentInfo,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    confirmDeleteStudent,
    loadStudents,
  }
})
