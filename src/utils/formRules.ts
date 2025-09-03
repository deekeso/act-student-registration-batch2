import {
  validateEmailField,
  validatePasswordField,
  validateUsernameField,
} from '@/composables/userValidation'
import type { FormRules } from 'element-plus'

export const registerRules: FormRules = {
  email: [
    {
      validator: (rule, value, callback) => {
        const { valid, message } = validateEmailField(value)
        if (valid) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  username: [
    {
      validator: (rule, value, callback) => {
        const { valid, message } = validateUsernameField(value)
        if (valid) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        const { valid, message } = validatePasswordField(value)
        if (valid) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}

export const loginRules: FormRules = {
  username: [
    {
      validator: (rule, value, callback) => {
        const { valid, message } = validateUsernameField(value)
        if (valid) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        const { valid, message } = validatePasswordField(value)
        if (valid) {
          callback()
        } else {
          callback(new Error(message))
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
}
