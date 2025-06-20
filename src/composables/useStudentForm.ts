import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Students } from '@/types/Students'

export function useStudentForm(initialData: Partial<Students> = {}) {
  const state = reactive<Students>({
    firstName: initialData.firstName || '',
    middleInitial: initialData.middleInitial || '',
    lastName: initialData.lastName || '',
    birthDate: initialData.birthDate || '',
    age: initialData.age || 0,
    address: initialData.address || '',
    course: initialData.course || '',
  })

  const formRef = ref<FormInstance | null>(null)

  const rules = reactive<FormRules>({
    firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
    lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
    course: [{ required: true, message: 'Please select a course', trigger: 'change' }],
  })

  watch(
    () => initialData,
    (newData) => {
      Object.assign(state, {
        firstName: newData.firstName || '',
        middleInitial: newData.middleInitial || '',
        lastName: newData.lastName || '',
        birthDate: newData.birthDate || '',
        age: newData.age || 0,
        address: newData.address || '',
        course: newData.course || '',
      })
    },
    { deep: true },
  )

  const submit = async () => {
    if (!formRef.value) return { success: false, data: null }
    try {
      const valid = await formRef.value.validate()
      if (valid) {
        return { success: true, data: { ...state } }
      }
      return { success: false, data: null }
    } catch (error) {
      console.error('Submission error:', error)
      return { success: false, data: null }
    }
  }

  const resetForm = () => {
    Object.assign(state, {
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

  return { state, formRef, rules, submit, resetForm }
}
