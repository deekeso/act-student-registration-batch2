import { reactive, ref, watch, type Ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Student } from '@/types/Students'
import { useStudentStore } from '@/stores/studentsStore'

export function useStudentActions(formRef: Ref<FormInstance | null>) {
  const store = useStudentStore()
  const isEditDrawerOpen = ref(false)
  const editingStudent = ref<Student | null>(null)
  //const formRef = ref<FormInstance | null>(null)

  const state = reactive<Student>({
    id: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    birthDate: '',
    age: 0,
    address: '',
    course: '',
  })

  const rules = reactive<FormRules>({
    firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
    lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
    course: [{ required: true, message: 'Please select a course', trigger: 'change' }],
    age: [
      { type: 'number', min: 0, message: 'Age must be a non-negative number', trigger: 'blur' },
    ],
  })

  // Watch formRef to ensure it's initialized
  watch(formRef, (newRef) => {
    if (newRef) {
      console.log('formRef initialized:', newRef)
    }
  })

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
            console.log('Current form state:', state)
          }
          resolve(isValid)
        })
      })
      if (valid) {
        console.log('Form validated successfully:', state)
        return { success: true, data: { ...state } }
      }
      console.log('Form validation failed')
      return { success: false, data: null }
    } catch (error) {
      console.error('Form submission error:', error)
      return { success: false, data: null }
    }
  }

  const resetForm = () => {
    Object.assign(state, {
      id: '',
      firstName: '',
      middleInitial: '',
      lastName: '',
      birthDate: '',
      age: 0,
      address: '',
      course: '',
    })
    formRef.value?.resetFields()
  }

  const handleEdit = (student: Student) => {
    if (!student.id) {
      console.error('Cannot edit student: missing id', student)
      return
    }

    editingStudent.value = student
    console.log({ editingstudent: editingStudent.value })
    isEditDrawerOpen.value = true
    Object.assign(state, {
      id: editingStudent.value.id,
      firstName: student.firstName,
      middleInitial: student.middleInitial,
      lastName: student.lastName,
      birthDate: student.birthDate,
      age: Number(student.age),
      address: student.address,
      course: student.course,
    })
    console.log('Editing Student:', student)
  }

  const handleDelete = (student: Student) => {
    store.deleteStudent(student)
    editingStudent.value = null
    isEditDrawerOpen.value = false
    resetForm()
    console.log('Deleted Student:', student)
  }

  const handleCancel = () => {
    editingStudent.value = null
    isEditDrawerOpen.value = false
    resetForm()
    console.log('Cancel')
  }

  const handleUpdate = async () => {
    const result = await submitForm()
    if (result.success && result.data && editingStudent.value) {
      const id = editingStudent.value.id

      store.updateStudent({ ...result.data, id })
      editingStudent.value = null
      isEditDrawerOpen.value = false
      resetForm()
      console.log('Updated Student:', result.data)
      return true
    } else {
      console.error('Update failed:', result)
      return false
    }
  }

  return {
    state,
    formRef,
    rules,
    submitForm,
    resetForm,
    isEditDrawerOpen,
    editingStudent,
    handleEdit,
    handleDelete,
    handleCancel,
    handleUpdate,
  }
}
