import { reactive, ref, watch, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'
import type { Student } from '@/types/Students'
import { useStudentStore } from '@/stores/studentsStore'

export function useStudentActions(formRef: Ref<FormInstance | null>) {
  const store = useStudentStore() // access the Pinia student store
  const isEditDrawerOpen = ref(false) // state for controlling the edit drawer
  const editingStudent = ref<Student | null>(null) // Holds the student currently being edited
  const state = reactive<Student>({
    id: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    birthDate: '',
    age: 0,
    streetAddress: '',
    barangay: '',
    city: '',
    province: '',
    zipCode: '',
    course: '',
  })

  // // Validation rules for the form fields (Element Plus format)
  // const rules = reactive<FormRules>({
  //   firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
  //   lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
  //   course: [{ required: true, message: 'Please select a course', trigger: 'change' }],
  //   age: [
  //     { type: 'number', min: 0, message: 'Age must be a non-negative number', trigger: 'blur' },
  //   ],
  // })

  // Watch formRef to ensure it's initialized (for debugging)
  watch(formRef, (newRef) => {
    if (newRef) {
      console.log('formRef initialized:', newRef)
    }
  })

  // Validate and submit the form
  const submitForm = async () => {
    if (!formRef.value) {
      console.error('formRef is null. Form may not be initialized.')
      return { success: false, data: null }
    }

    try {
      const valid = await new Promise((resolve) => {
        formRef.value!.validate((isValid, errors) => {
          if (errors) {
            console.log('Validation errors:', errors)
          }
          resolve(isValid)
        })
      })

      if (!valid) {
        console.log('Form validation failed')
        return { success: false, data: null }
      }

      const allStudents = store.allStudents()

      // Normalize birthDate to YYYY-MM-DD string for consistent comparison
      const normalizeDate = (date: string | Date): string => {
        if (!date) return ''
        const d = date instanceof Date ? date : new Date(date)
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
      }

      const isDuplicate = allStudents.some((student) => {
        if (editingStudent.value && student.id === editingStudent.value.id) {
          return false
        }

        // Normalize fields for comparison
        const formBirthDate = normalizeDate(state.birthDate)
        const studentBirthDate = normalizeDate(student.birthDate)
        const formMiddleInitial = state.middleInitial || ''
        const studentMiddleInitial = student.middleInitial || ''
        const formZipCode = state.zipCode || ''
        const studentZipCode = student.zipCode || ''

        return (
          student.firstName === state.firstName &&
          studentMiddleInitial === formMiddleInitial &&
          student.lastName === state.lastName &&
          studentBirthDate === formBirthDate &&
          student.age === Number(state.age) &&
          student.streetAddress === state.streetAddress &&
          student.barangay === state.barangay &&
          student.city === state.city &&
          student.province === state.province &&
          studentZipCode === formZipCode &&
          student.course === state.course
        )
      })

      if (isDuplicate) {
        console.log('Duplicate student found, submission prevented', {
          formData: state,
          students: allStudents,
        })
        return {
          success: false,
          data: null,
          error: 'A student with identical details already exists',
        }
      }

      console.log('Form validated successfully:', state)
      return { success: true, data: { ...state, birthDate: normalizeDate(state.birthDate) } }
    } catch (error) {
      console.error('Form submission error:', error)
      return { success: false, data: null }
    }
  }

  // Reset the form fields to their initial state
  const resetForm = () => {
    Object.assign(state, {
      id: '',
      firstName: '',
      middleInitial: '',
      lastName: '',
      birthDate: '',
      age: 0,
      streetAddress: '',
      barangay: '',
      city: '',
      province: '',
      zipCode: '',
      course: '',
    })
    formRef.value?.resetFields()
  }

  // Prepare the form for editing a student
  const handleEdit = (student: Student) => {
    if (!student.id) {
      console.error('Cannot edit student: missing id', student)
      return
    }

    editingStudent.value = student
    console.log({ editingstudent: editingStudent.value }) // for debugging
    isEditDrawerOpen.value = true
    Object.assign(state, {
      id: editingStudent.value.id,
      firstName: student.firstName,
      middleInitial: student.middleInitial,
      lastName: student.lastName,
      birthDate: student.birthDate,
      age: Number(student.age),
      streetAddress: student.streetAddress,
      barangay: student.barangay,
      city: student.city,
      province: student.province,
      zipCode: student.zipCode,
      course: student.course,
    })
    console.log('Editing Student:', student)
  }

  // Delete a student using the store
  const handleDelete = (student: Student) => {
    store.deleteStudent(student)
    editingStudent.value = null
    isEditDrawerOpen.value = false
    resetForm()
    console.log('Deleted Student:', student)
  }

  // Cancel editing and reset form
  const handleCancel = () => {
    editingStudent.value = null
    isEditDrawerOpen.value = false
    resetForm()
    console.log('Cancel')
  }

  // Update a student after editing
  const handleUpdate = async () => {
    const result = await submitForm() // Submit the form
    if (result.success && result.data && editingStudent.value) {
      // If the form is valid, update the student
      const id = editingStudent.value.id // Get the id of the student to update
      store.updateStudent({ ...result.data, id }) // Update the student using the store
      editingStudent.value = null // Reset the editing student
      isEditDrawerOpen.value = false // Reset the edit drawer
      resetForm() // Reset the form
      console.log('Updated Student:', result.data) // Log the updated student
      return true
    } else {
      console.error('Update failed:', result) // If the form is not valid, log the error
      return false
    }
  }

  return {
    state, // Reactive form data
    formRef, // Form instance ref
    // rules, // Validation rules
    submitForm, // Validate and submit
    resetForm, // Reset form fields
    isEditDrawerOpen, // Edit drawer state
    editingStudent, // Currently editing student
    handleEdit, // Prepare for edit
    handleDelete, // Delete student
    handleCancel, //  Cancel edit
    handleUpdate, // Update student
  }
}
