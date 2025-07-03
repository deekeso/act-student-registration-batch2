import { reactive } from 'vue'
import type { FormItemRule } from 'element-plus'

function nameValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) return callback(new Error('This field is required'))
  if (!/^[A-Za-zñÑ\s'-]+$/.test(value)) {
    callback(new Error('Only letters, spaces, apostrophes, and hyphens allowed'))
  } else if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
  } else if ((value.match(/[A-Za-zñÑ]/g) || []).length < 2) {
    callback(new Error('Must contain at least two letters'))
  } else {
    callback()
  }
}

function middleInitialValidator(
  rule: FormItemRule,
  value: string,
  callback: (error?: Error) => void,
) {
  if (!/^[A-Za-zñÑ\s-]{0,1}$/.test(value)) {
    callback(new Error('Only 1 letter allowed'))
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

function addressValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) return callback(new Error('This field is required'))
  if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
  } else {
    callback()
  }
}

function spaceChecker(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
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
  streetAddress: [{ validator: addressValidator, trigger: 'blur' }],
  barangay: [{ validator: addressValidator, trigger: 'blur' }],
  city: [{ validator: addressValidator, trigger: 'blur' }],
  province: [{ validator: spaceChecker, trigger: 'blur' }],
  zipCode: [{ validator: spaceChecker, trigger: 'blur' }],
  course: [{ required: true, message: 'This field is required', trigger: 'change' }],
})

export const entryRestriction = () => {
  const onlyDigits = (event: KeyboardEvent) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const onlyLetters = (event: KeyboardEvent) => {
    if (!/[a-zA-ZñÑ\s.'-]/.test(event.key)) {
      event.preventDefault()
    }
  }

  return {
    onlyDigits,
    onlyLetters,
  }
}

export function formatAddress(student: {
  streetAddress: string
  barangay: string
  city: string
  province: string
  zipCode: string
}) {
  const parts = [
    student.streetAddress,
    student.barangay,
    student.city,
    student.province,
    student.zipCode,
  ].filter((part) => part && part.trim())

  return parts.join(', ')
}
