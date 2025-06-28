import { reactive } from 'vue'
import type { FormItemRule } from 'element-plus'

function nameValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) return callback(new Error('This field is required'))
  if (!/^[A-Za-z\s'-]+$/.test(value)) {
    callback(new Error('Only letters, spaces, apostrophes, and hyphens allowed'))
  } else {
    callback()
  }
}

function middleInitialValidator(
  rule: FormItemRule,
  value: string,
  callback: (error?: Error) => void,
) {
  if (!/^[A-Za-z]{0,3}$/.test(value)) {
    callback(new Error('Only 1 to 3 letters allowed'))
  } else {
    callback()
  }
}

function birthDateValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) return callback(new Error('This field is required'))
  const today = new Date()
  const birth = new Date(value)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  if (age < 18) {
    callback(new Error('Student must be at least 18 years old'))
  } else {
    callback()
  }
}

export const formRules = reactive({
  lastName: [{ validator: nameValidator, trigger: 'blur' }],
  firstName: [{ validator: nameValidator, trigger: 'blur' }],
  middleInitial: [{ validator: middleInitialValidator, trigger: 'blur' }],
  birthDate: [
    { validator: birthDateValidator, trigger: 'blur', message: 'This field is required' },
  ],
  streetAddress: [{ required: true, message: 'This field is required', trigger: 'blur' }],
  barangay: [{ required: true, message: 'This field is required', trigger: 'blur' }],
  city: [{ required: true, message: 'This field is required', trigger: 'blur' }],
  // province: [{ required: true, message: 'This field is required', trigger: 'blur' }],
  // zipCode: [{ required: true, message: 'This field is required', trigger: 'blur' }],
  course: [{ required: true, message: 'This field is required', trigger: 'change' }],
})

export const entryRestriction = () => {
  const onlyDigits = (event: KeyboardEvent) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const onlyLetters = (event: KeyboardEvent) => {
    if (!/[a-zA-Z\s.'-]/.test(event.key)) {
      event.preventDefault()
    }
  }

  return {
    onlyDigits,
    onlyLetters,
  }
}
