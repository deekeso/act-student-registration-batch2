import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Student } from '@/types/Students'
import { students as initialStudents, courses } from '@/constants/index'
import { v4 as uuidv4 } from 'uuid'

export const useStudentStore = defineStore(
  'students', // store name
  () => {
    const studentsRef = ref<Student[]>([]) // state (reactive array)

    const addStudent = (student: Student) => {
      if (!courses.some((course) => course.value === student.course)) {
        console.error('Invalid course:', student.course)
        return
      }
      const newStudent = {
        ...student,
        id: student.id || uuidv4(), // Use existing id or generate new one
        age: Number(student.age), // Ensure age is a number
      }
      // add student
      studentsRef.value.push(newStudent)
      console.log('Added student:', newStudent)
    }

    const updateStudent = (updatedStudent: Student) => {
      // validate course
      if (!courses.some((course) => course.value === updatedStudent.course)) {
        console.error('Invalid course:', updatedStudent.course)
        return
      }
      // validate id
      if (!updatedStudent.id) {
        console.error('Cannot update student: missing id', updatedStudent)
        return
      }
      // update student
      const index = studentsRef.value.findIndex((s) => s.id === updatedStudent.id)
      if (index !== -1) {
        studentsRef.value[index] = { ...updatedStudent, age: Number(updatedStudent.age) }
        console.log('Updated student:', { ...updatedStudent })
        return true // Return true for success
      } else {
        console.error('Student not found for id:', updatedStudent.id)
        console.log(
          'Current students:',
          studentsRef.value.map((s) => ({
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName,
          })),
        )
        return false
      }
    }

    const deleteStudent = (student: Student) => {
      // validate id
      if (!student.id) {
        console.error('Cannot delete student: missing id', student)
        return
      }
      // delete student
      const index = studentsRef.value.findIndex((s) => s.id === student.id)
      if (index !== -1) {
        studentsRef.value.splice(index, 1)
        console.log('Deleted student:', student)
      }
    }

    const allStudents = () => {
      // return all students
      console.log('Retrieving all students:', studentsRef.value)
      return studentsRef.value
    }

    const resetStudents = () => {
      // reset students
      studentsRef.value = initialStudents.map((student: Student) => ({
        ...student,
        id: uuidv4(), // Generate unique id for initial students
        age: Number(student.age), // Ensure age is a number
      }))
      console.log('Students reset:', studentsRef.value)
    }

    return {
      students: studentsRef,
      courses,
      addStudent,
      updateStudent,
      deleteStudent,
      allStudents,
      resetStudents,
    }
  },
  {
    persist: true,
  },
)
