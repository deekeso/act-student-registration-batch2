import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Student } from '@/types/Students'
import { students as initialStudents, courses } from '@/constants/index'

export const useStudentStore = defineStore(
  'students',
  () => {
    const students = ref<Student[]>(initialStudents)

    const getStudentsByCourse = (course: string) => {
      return students.value.filter((s) => s.course === course)
    }

    const addStudent = (student: Student) => {
      students.value.push({ ...student })
    }

    const updateStudent = (updatedStudent: Student) => {
      const index = students.value.findIndex(
        (s) =>
          s.firstName === updatedStudent.firstName &&
          s.lastName === updatedStudent.lastName &&
          s.birthDate === updatedStudent.birthDate,
      )
      if (index !== -1) {
        students.value[index] = { ...updatedStudent }
      }
    }

    const deleteStudent = (student: Student) => {
      const index = students.value.findIndex(
        (s) =>
          s.firstName === student.firstName &&
          s.lastName === student.lastName &&
          s.birthDate === student.birthDate,
      )
      if (index !== -1) {
        students.value.splice(index, 1)
      }
    }

    const allStudents = () => {
      console.log('Retrieving all students:', students.value)
      return students.value
    }

    return {
      students,
      courses,
      getStudentsByCourse,
      addStudent,
      updateStudent,
      deleteStudent,
      allStudents,
    }
  },
  {
    persist: true,
  },
)
