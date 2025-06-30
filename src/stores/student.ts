import { defineStore } from 'pinia'

// Interface for the student
export interface Student {
  id: number
  firstName: string
  middleInitial: string
  lastName: string
  name: string
  birthDate: string
  age: number
  address: string
  course: string
  createdAt: string
  updatedAt?: string
}

// Define the student store
export const useStudentStore = defineStore('student', {
  state: () => ({
    students: [] as Student[],
    nextId: 1,
    courses: [
      'Bachelor of Science in Information Technology',
      'Bachelor of Science in Computer Science',
      'Bachelor of Science in Tourism',
      'Bachelor of Science in Hotel and Restaurant Management',
      'Bachelor of Science in Nursing',
    ],
  }),

  getters: {
    getStudentById:
      (state) =>
      (id: number): Student | undefined => {
        return state.students.find((student) => student.id === id)
      },

    // Get the count of students for the home view statistics 
    studentCount: (state): number => {
      return state.students.length
    },

    // Get students by course for the students view
    studentsByCourse:
      (state) =>
      (course: string): Student[] => {
        return state.students.filter((student) => student.course === course)
      },

    // Get available courses for the students view dropdown
    availableCourses: (state): string[] => {
      return state.courses
    },
  },

  actions: {
    // Add a new student, assigns an ID and createdAt timestamp
    addStudent(student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
      const newStudent = {
        ...student,
        id: this.nextId++,
        createdAt: new Date().toISOString(),
      }
      this.students.push(newStudent)
      return newStudent
    },

    // Update an existing student, assigns an updatedAt timestamp
    updateStudent(updatedStudent: Student): boolean {

      // Find the index or ID of the student to update
      const index = this.students.findIndex((student) => student.id === updatedStudent.id)
      if (index !== -1) {
        this.students[index] = {
          ...updatedStudent,
          updatedAt: new Date().toISOString(),
        }
        return true
      }
      return false
    },

    // Delete a student by ID
    deleteStudent(id: number): boolean {
      const index = this.students.findIndex((student) => student.id === id)
      if (index !== -1) {
        this.students.splice(index, 1)
        return true
      }
      return false
    },
  },

  persist: {
    key: 'student-registration-data',
    storage: localStorage,
  },
})
