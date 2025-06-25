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
  if (!value) return callback(new Error('Please enter middle initial'))
  if (!/^[A-Za-z]$/.test(value)) {
    callback(new Error('Only 1 to 3 letters allowed'))
  } else {
    callback()
  }
}

function birthDateValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) return callback(new Error('Please enter birth date'))
  const today = new Date()
  const birth = new Date(value)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  if (age < 12) {
    callback(new Error('Student must be at least 12 years old'))
  } else {
    callback()
  }
}

export const formRules = reactive({
  lastName: [{ validator: nameValidator, trigger: 'blur' }],
  firstName: [{ validator: nameValidator, trigger: 'blur' }],
  middleInitial: [{ validator: middleInitialValidator, trigger: 'blur' }],
  birthDate: [{ validator: birthDateValidator, trigger: 'change' }],
  age: [
    { required: true, message: 'Please enter age', trigger: 'blur' },
    { type: 'number', min: 1, max: 99, message: 'Age must be between 1 and 99', trigger: 'blur' },
  ],
  address: [{ required: true, message: 'Please enter address', trigger: 'blur' }],
  course: [{ required: true, message: 'Please select a course', trigger: 'change' }],
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
