import type { FormRules } from 'element-plus'

const emailRegex =
  /^(?!.*([!#$%^&*()_\-+=\[\]{};:'",<>/?\\|`~])\1{2,})(?!.*@.*@)[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.[A-Za-z]{2,}$/

const nameRegex = /^(?!.*([-'"()])\1)[A-Za-zÑñ\s'"()-]+$/
const addressRegex = /^(?!.*([,.\-])\1)(?=.*[A-Za-zÑñ])[A-Za-zÑñ0-9\s,.\-]+$/

const validateEmail = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }
    if (!emailRegex.test(value.trim())) {
      return callback(new Error(`Please enter a valid ${fieldName}`))
    }
    callback()
  }
}

const validateName = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }
    if (!nameRegex.test(value.trim())) {
      return callback(new Error(`Please enter a valid ${fieldName}`))
    }
    if (value.trim().length < 2 || value.trim().length > 100) {
      return callback(new Error('Minimum of 2 characters'))
    }
    callback()
  }
}

const validateAddressField = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }

    if (!addressRegex.test(value.trim())) {
      return callback(new Error(`Please enter a valid ${fieldName}`))
    }

    callback()
  }
}

export const userFormRule: FormRules = {
  name: [
    {
      required: true,
      validator: validateName('name'),
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: 'Please enter your username',
      trigger: 'blur',
    },
  ],

  email: [
    {
      required: true,
      validator: validateEmail('email'),
      trigger: 'blur',
    },
  ],
  street: [
    {
      required: true,
      validator: validateAddressField('street'),
      trigger: 'blur',
    },
  ],
  city: [
    {
      required: true,
      validator: validateAddressField('city'),
      trigger: 'blur',
    },
  ],
}
