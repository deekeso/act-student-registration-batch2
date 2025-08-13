export const emailRegex = /^[A-Za-z0-9]{6,}[^\s@]*@[^\s@]+\.[^\s@]+$/
export const usernameRegex = /^.{6,}$/
export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

// Whitespace checks
export function hasLeadingOrTrailingWhitespace(value: string): boolean {
  return /^\s|\s$/.test(value)
}

export function hasConsecutiveSpaces(value: string): boolean {
  return / {2,}/.test(value)
}

export function isEmpty(value: string): boolean {
  return !value || value.trim() === ''
}

export function validateEmail(email: string): boolean {
  return emailRegex.test(email)
}

export function validateUsername(username: string): boolean {
  return usernameRegex.test(username)
}

export function validatePassword(password: string): boolean {
  return passwordRegex.test(password)
}

export function validateEmailField(email: string) {
  if (isEmpty(email)) {
    console.log(`validate ${email}`)
    return { valid: false, message: 'Email is required' }
  }
  if (hasLeadingOrTrailingWhitespace(email)) {
    return { valid: false, message: 'Email cannot have leading or trailing spaces' }
  }
  if (hasConsecutiveSpaces(email)) {
    return { valid: false, message: 'Email cannot have consecutive spaces' }
  }
  if (!validateEmail(email)) {
    return { valid: false, message: 'Please enter a valid email address, eg., user123@example.com' }
  }
  return { valid: true, message: '' }
}

export function validateUsernameField(username: string) {
  if (isEmpty(username)) {
    return { valid: false, message: 'Username is required' }
  }
  if (hasLeadingOrTrailingWhitespace(username)) {
    return { valid: false, message: 'Username cannot have leading or trailing spaces' }
  }
  if (hasConsecutiveSpaces(username)) {
    return { valid: false, message: 'Username cannot have consecutive spaces' }
  }
  if (!validateUsername(username)) {
    return { valid: false, message: 'Username must be at least 6 characters' }
  }
  return { valid: true, message: '' }
}

export function validatePasswordField(password: string) {
  if (isEmpty(password)) {
    return { valid: false, message: 'Password is required' }
  }
  if (hasLeadingOrTrailingWhitespace(password)) {
    return { valid: false, message: 'Password cannot have leading or trailing spaces' }
  }
  if (hasConsecutiveSpaces(password)) {
    return { valid: false, message: 'Password cannot have consecutive spaces' }
  }
  if (!validatePassword(password)) {
    return {
      valid: false,
      message:
        'Password must be 8+ chars, with 1 uppercase, 1 symbol, and letters/numbers.',
    }
  }
  return { valid: true, message: '' }
}

export function validateConfirmPasswordField(newPassword: string, confirmPassword: string) {
  if (isEmpty(confirmPassword)) {
    return { valid: false, message: 'Please confirm your password' }
  }
  if (newPassword !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' }
  }
  return { valid: true, message: '' }
}
