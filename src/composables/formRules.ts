import { reactive, computed } from 'vue'
import type { FormItemRule } from 'element-plus'

function nameValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) return callback(new Error('This field is required'))
  if (!/^[A-Za-zñÑ\s'-]+$/.test(value)) {
    callback(new Error('Only letters, spaces, apostrophes, and hyphens allowed'))
  } else if (/\s{2,}/.test(value)) {
    callback(new Error('No consecutive spaces allowed'))
  } else if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
  } else if ((value.match(/[A-Za-zñÑ]/g) || []).length < 2) {
    callback(new Error('Must contain at least 2 letters'))
  } else {
    callback()
  }
}

function middleInitialValidator(
  rule: FormItemRule,
  value: string,
  callback: (error?: Error) => void,
) {
  if (value.trim() === '') {
    // Allow empty string (no middle initial), but not spaces
    if (value !== '') {
      callback(new Error('Space is not allowed'))
      return
    }
  } else if (!/^[A-Za-zñÑ-]{1}$/.test(value)) {
    callback(new Error('Only 1 letter allowed'))
    return
  }
  callback()
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
  if (/\s{2,}/.test(value)) {
    callback(new Error('No consecutive spaces allowed'))
  } else if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
  } else if ((value.match(/[A-Za-zñÑ]/g) || []).length < 4) {
    callback(new Error('Must contain at least 4 letters'))
  } else {
    callback()
  }
}

function spaceChecker(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) {
    // Allow empty input (0 characters)
    callback()
  } else if (/\s{2,}/.test(value)) {
    callback(new Error('No consecutive spaces allowed'))
  } else if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
  } else if ((value.match(/[A-Za-zñÑ]/g) || []).length < 4) {
    callback(new Error('Must contain at least 4 letters'))
  } else {
    callback()
  }
}

function zipcodeValidator(rule: FormItemRule, value: string, callback: (error?: Error) => void) {
  if (!value) {
    // Allow empty input
    callback()
  } else if (value.length !== 4) {
    callback(new Error('Zipcode must be exactly 4 digits long'))
  } else {
    callback()
  }
}

// forgot password
export function passwordValidator(
  rule: FormItemRule,
  value: string,
  callback: (error?: Error) => void,
) {
  if (!value) return callback(new Error('New password is required'))
  if (/\s{2,}/.test(value)) {
    callback(new Error('No consecutive spaces allowed'))
  } else if (/^\s|\s$/.test(value)) {
    callback(new Error('No leading or trailing spaces allowed'))
  } else if ((value.match(/[A-Za-zñÑ]/g) || []).length < 8) {
    callback(new Error('Must contain at least 8 letters'))
  } else {
    callback()
  }
}

export function confirmPasswordValidator(passwordGetter: () => string) {
  return (rule: FormItemRule, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback(new Error('Confirm password is required'))
    } else if (value !== passwordGetter()) {
      callback(new Error('Passwords do not match'))
    } else {
      callback()
    }
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
  zipCode: [{ validator: zipcodeValidator, trigger: 'blur' }],
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

  const sanitizeZipCode = (event: ClipboardEvent, maxLength: number = 4) => {
    event.preventDefault()
    const pastedText = event.clipboardData?.getData('text') || ''
    // Keep only digits, truncate to maxLength
    return pastedText.replace(/[^0-9]/g, '').slice(0, maxLength)
  }

  const sanitizeLetters = (event: ClipboardEvent, maxLength?: number) => {
    event.preventDefault()
    const pastedText = event.clipboardData?.getData('text') || ''
    // Keep only letters, ñ/Ñ, spaces, periods, apostrophes, hyphens
    const sanitized = pastedText.replace(/[^a-zA-ZñÑ\s.'-]/g, '').toUpperCase()
    return maxLength ? sanitized.slice(0, maxLength) : sanitized
  }

  const sanitizeInput = (event: ClipboardEvent, maxLength?: number) => {
    event.preventDefault()
    const pastedText = event.clipboardData?.getData('text') || ''
    // Keep only letters, ñ/Ñ, spaces, periods, apostrophes, hyphens
    const sanitized = pastedText.replace(/[^a-zA-ZñÑ\s.'-]/g, '').toUpperCase()
    return maxLength ? sanitized.slice(0, maxLength) : sanitized
  }

  return {
    onlyDigits,
    onlyLetters,
    sanitizeZipCode,
    sanitizeLetters,
    sanitizeInput,
  }
}

// address formatter
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

// auto uppercase function for forms
export function useUpperCaseModel<T extends object, K extends keyof T>(state: T, field: K) {
  return computed({
    get: () => state[field],
    set: (val: string) => {
      // Only set if the field is a string
      if (typeof state[field] === 'string') {
        state[field] = val.toUpperCase() as T[K]
      }
    },
  })
}
