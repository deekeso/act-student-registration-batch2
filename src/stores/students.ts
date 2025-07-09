import { defineStore } from 'pinia'
import type { Students } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { v4 as uuidv4 } from "uuid"


export const useStudents = defineStore('students', {
  // Defines the default state for the store.
  state: () => ({
    students: JSON.parse(localStorage.getItem('students') || '[]') as Students[],
    filterCourse: '',
    filterName: '',
  }),

  getters: {
    allStudents: (state): Students[] => {
    return state.students.filter((student) => {
      const matchCourse = state.filterCourse
        ? student.course?.toLowerCase() === state.filterCourse.toLowerCase()
        : true

      const first = student.firstname?.toLowerCase()
      const middle = student.middlename?.toLowerCase() || ''
      const last = student.lastname?.toLowerCase()

      const full1 = `${first} ${last}`.trim() // firstname and lastname
      const full2 = `${first} ${middle} ${last}`.trim() // firstname, middlename, and lastname
      const filter = state.filterName.toLowerCase().trim()

      const matchName = filter
        ? full1.includes(filter) || full2.includes(filter)
        : true

      return matchCourse && matchName
    })
  },

    getStudentById: (state) => {
      return (id: string) => state.students.find((student) => student.id === id)
    },

    getStudentByCourse: (state) => {
      return (course: string) => state.students.find((student) => student.course === course)
    },
  },

  actions: {
    getLocalStorage(){
      return JSON.parse(localStorage.getItem('students') || '[]') as Students[]
    },
    setFilterCourse(course: string) {
      this.filterCourse = course
    },

    setFilterName(name: string) {
      this.filterName = name
    },
    async onAddStudents(studentData: Students) {
      const newStudent = {
        ...studentData,
        id: uuidv4(),
      };

      if (this.isDuplicateStudent(newStudent)) {
        try {
          await ElMessageBox.confirm(
            `${studentData.firstname } ${studentData.lastname} student record already exists. \nDo you want to continue adding?`,
            'Warning',
            {
              confirmButtonText: 'Yes',
              cancelButtonText: 'Cancel',
              type: 'warning',
            }
          );

          this.students.push(newStudent);
          this.SaveLocalStorage();
          ElMessage.success('Duplicate student added by user confirmation');
        } catch {
          ElMessage.info('Operation canceled');
        }
      } else {
        this.students.push(newStudent);
        this.SaveLocalStorage();
        ElMessage.success('Successfully added new student record');
      }
    },

   isDuplicateStudent(newStudent: Students, excludeId?: string): boolean {
    return this.students.some(student => {
      if (excludeId && student.id === excludeId) return false; // Exclude current student
      return this.onExistingData(student, newStudent);
    });
  },


    onExistingData(oldStudentData: Students, newStudentData: Students) {
      return (
        oldStudentData.firstname === newStudentData.firstname &&
        oldStudentData?.middlename === newStudentData?.middlename &&
        oldStudentData.lastname === newStudentData.lastname &&
        oldStudentData.age === newStudentData.age &&
        oldStudentData.birthdate === newStudentData.birthdate 
        // oldStudentData.address === newStudentData.address &&
        // oldStudentData.course === newStudentData.course
      );
    },
    async onUpdateStudentInfo(studentData: Students) {
      const index = this.students.findIndex(student => student.id === studentData.id);

      if (index === -1) {
        ElMessage.error('Update failed: Student not found');
        return;
      }

      const originalStudent = this.students[index];

      // Check if the updated data is exactly the same
      if (JSON.stringify(originalStudent) === JSON.stringify(studentData)) {
        ElMessage.info('No changes were made');
        return;
      }

      // Exclude the student being updated from the duplicate check
      if (this.isDuplicateStudent(studentData, studentData.id)) {
        try {
          await ElMessageBox.confirm(
            'Another student with this data already exists. Do you want to continue?',
            'Warning',
            {
              confirmButtonText: 'Yes',
              cancelButtonText: 'Cancel',
              type: 'warning',
            }
          );
        } catch {
          ElMessage.info('Update canceled');
          return;
        }
      }

      // Proceed with update
      this.students[index] = studentData;
      this.SaveLocalStorage();
      ElMessage.success('Update successful');
    },

    onDeleteStudentInfo(id: string) {
      try {
        console.log('argument id: ' + id)
        
        this.students = this.students.filter((student: Students) => student.id !== id)
        this.SaveLocalStorage()
        ElMessage.success('Successfully Deleted')
      } catch (error) {
        ElMessage.error('Deletion failed')
        console.error(error)
      }
    },
    SaveLocalStorage(){
      localStorage.setItem('students',JSON.stringify(this.students))
    }
  },
})
