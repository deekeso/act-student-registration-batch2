import type { FormRules } from 'element-plus'
import { ref } from 'vue'

const namePattern = /^[A-Za-z\s'-]+$/
const middleInitialPattern = /^[A-Za-z\s]{1,3}$/
const newPassword = ref('')
const addressPattern = /^[^!@$%^&*()_=+\\\[\]{}:;"'?><]*$/

const validateCollegeAge = (_rule: unknown, value: number, callback: (error?: Error) => void) => {
  if (!value) {
    return callback(new Error('Age is required'))
  }
  if (value < 17) {
    return callback(new Error('Minimum age is 17'))
  }
  if (value > 100) {
    return callback(new Error('Invalid Age'))
  }
  callback()
}

const validateName = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }
    if (value.trim().length < 2 || value.trim().length > 50) {
      return callback(new Error('Length should be 2 to 50 characters'))
    }
    if (!namePattern.test(value.trim())) {
      return callback(new Error('Numbers are invalid name inputs'))
    }
    callback()
  }
}

const validateMiddleInitial = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (!value || value.trim() === '') {
    return callback()
  }

  const trimmedValue = value.trim()

  if (trimmedValue.length > 3) {
    return callback(new Error('Length maximum is 3 characters'))
  }

  if (!middleInitialPattern.test(trimmedValue)) {
    return callback(new Error('Numbers are invalid inputs'))
  }

  callback()
}

const validateAddress = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value || value.trim() === '') {
    return callback(new Error('Please input address'))
  }
  if (value.trim().length < 10) {
    return callback(new Error('Address should be at least 10 characters'))
  }
  if (!addressPattern.test(value.trim())) {
    return callback(new Error('Specific special characters are invalid'))
  }
  callback()
}

export const studentFormRules: FormRules = {
  firstName: [{ validator: validateName('first name'), trigger: 'blur' }],
  middleInitial: [{ validator: validateMiddleInitial, trigger: 'blur' }],
  lastName: [{ validator: validateName('last name'), trigger: 'blur' }],
  birthDay: [{ required: true, message: 'Please select birthday', trigger: 'change' }],
  age: [
    { required: true, message: 'Please input age', trigger: 'blur' },
    { required: true, type: 'number', message: 'Age must be a number', trigger: 'blur' },
    { validator: validateCollegeAge, trigger: 'blur' },
  ],
  address: [{ validator: validateAddress, trigger: 'blur' }],
  courses: [
    { required: true, message: 'Please select a course', trigger: 'blur' },
    {
      type: 'array',
      min: 1,
      message: 'Please select at least one course',
      trigger: 'change',
    },
  ],
}

export const adminFormRules: FormRules = {
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
}

export const passwordFields = {
  newPassword,
}

export const passwordResetRules: FormRules = {
  newPassword: [
    { required: true, message: 'Please input new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        if (value !== newPassword.value) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
