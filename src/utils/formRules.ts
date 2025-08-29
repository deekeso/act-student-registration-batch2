import type { FormRules } from 'element-plus'

export const registerRules: FormRules = {
  email: [
    {
      required: true,
      type: 'email',
      message: 'Please enter a valid email address',
      trigger: ['blur', 'change'],
    },
  ],
  username: [
    {
      required: true,
      message: 'Username is required',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
      trigger: ['blur', 'change'],
    },
    {
      min: 6,
      message: 'Password must be at least 6 characters',
      trigger: ['blur', 'change'],
    },
  ],
}

export const loginRules: FormRules = {
  username: [
    {
      required: true,
      message: 'Username is required',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
      trigger: ['blur', 'change'],
    },
  ],
}
