import { defineStore } from 'pinia'
import type { Users } from '@/types'
import { ElMessage } from 'element-plus'
import { dateFormatter } from '@/utils/dateFormatter'
import { v4 as uuidv4 } from "uuid"


export const useStudents = defineStore('students', {
  // Defines the default state for the store.
  state: () => ({
    students: JSON.parse(localStorage.getItem('students') || '[]') as Users[],
    filterCourse: '',
    filterName: '',
  }),

  getters: {

    /**
     * Returns a filtered list of students based on the selected course and name.
     * Filters:
     * - Course
     * - Fullname (firstname. lastname / middle) case insensitive
     * @param {any} state
     * @returns {any}
     */
    allStudents: (state): Users[] => {
      // Filter by course & name (case insensitive)
      return state.students.filter((student) => {
        const matchCourse = state.filterCourse
          ? student.course.toLowerCase() === state.filterCourse.toLowerCase()
          : true

        const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.toLowerCase().trim() 

        const matchName = state.filterName
          ? fullName.includes(state.filterName.toLowerCase())
          : true

        return matchCourse && matchName
      })
    },



    /**
     * Get student record by id
     * @param {any} state
     * @returns {any}
     */
    getStudentById: (state) => {
      return (id: string) => state.students.find((student) => student.id === id)
    },


    /**
     * getStudentByCourse
     * @param {any} state
     * @returns {any}
     */
    getStudentByCourse: (state) => {
      return (course: string) => state.students.find((student) => student.course === course)
    },
  },

  actions: {
    /**
     * Set the value for course filter
     * @param {any} course:string
     * @returns {string}
     */
    setFilterCourse(course: string) {
      this.filterCourse = course
    },

    /**
     * Set the value for name filter
     * @param {any} course:string
     * @returns {string}
     */
    setFilterName(name: string) {
      this.filterName = name
    },

    
    /**
     * fetch student records on localstroage
     * @returns {any}
     */
    getStudentOnLocalStorage() {
      return JSON.parse(localStorage.getItem('students') || '[]')
    },

    /**
     * Add students on the localstorage
     * @param {any} studentData:Users
     * @returns {any}
     */
    onAddStudents(studentData: Users) {
      const studentList = this.getStudentOnLocalStorage()
      
      const newStudent = {
        ...studentData,
        id: uuidv4(),
        birthdate: dateFormatter(studentData.birthdate.toString()),
      };
      
      studentList.push(newStudent)
      localStorage.setItem('students', JSON.stringify(studentList))
      this.students = studentList
      ElMessage.success('Successfully added new student record')
    },


    /**
     * Update the students on localstorage
     * @param {any} studentData:Users
     * @returns {any}
     */
    onUpdateStudentInfo(studentData: Users) {
      studentData.birthdate = dateFormatter(studentData.birthdate.toString())

      try {
        const updatedStudents = this.students.map((student: Users) =>
          student.id === studentData.id ? { ...studentData } : student,
        )
        localStorage.setItem('students', JSON.stringify(updatedStudents))
        this.students = updatedStudents
        ElMessage.success('Update successful')
      } catch (error) {
        ElMessage.error('Update failed')
        console.error(error)
      }
    },

    /**
     * Delete student record on localstorage
     * @param {any} id:string
     * @returns {any}
     */
    onDeleteStudentInfo(id: string) {
      try {
        console.log('argument id: ' + id)
        const currentStudents = this.getStudentOnLocalStorage()
        const updatedStudents = currentStudents.filter((student: Users) => student.id !== id)

        localStorage.setItem('students', JSON.stringify(updatedStudents))
        this.students = updatedStudents
        ElMessage.success('Deletion successful')
      } catch (error) {
        ElMessage.error('Deletion failed')
        console.error(error)
      }
    },
  },
})
