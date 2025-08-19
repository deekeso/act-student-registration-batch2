const nameRegex = /^[a-zA-Z ñÑ]+(?: [a-zA-Z ñÑ]+)*$/
const emailRegex = /^[A-Za-z0-9][A-Za-z0-9.]{5,}@[^\s@]+\.[^\s@]+$/
const usernameRegex = /^.{6,}$/
const streetRegex = /^[a-zA-Z0-9 ñÑ]+(?: [a-zA-Z0-9 ñÑ]+)*$/
const cityRegex = /^[a-zA-Z ñÑ]+$/

export function lettersOnly(e: KeyboardEvent) {
  // Letters, space, ñ, Ñ
  const char = e.key
  if (!/[a-zA-Z ñÑ]/.test(char)) e.preventDefault()
}

export function lettersNumbersOnly(e: KeyboardEvent) {
  // Letters, numbers, space, ñ, Ñ
  const char = e.key
  if (!/[a-zA-Z0-9 ñÑ]/.test(char)) e.preventDefault()
}

function hasLeadingOrTrailingWhitespace(value: string): boolean {
  return /^\s|\s$/.test(value)
}
function hasConsecutiveSpaces(value: string): boolean {
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

export function validateName(name: string): { valid: boolean; message: string } {
  if (isEmpty(name)) {
    return { valid: false, message: 'Name is required' }
  }

  if (name.length < 6) {
    return { valid: false, message: 'Name must be at least 6 characters.' }
  }
  if (name.length > 30) {
    return { valid: false, message: 'Name must be less than 50 characters.' }
  }
  if (hasLeadingOrTrailingWhitespace(name)) {
    return { valid: false, message: 'Name cannot have leading or trailing spaces.' }
  }
  if (hasConsecutiveSpaces(name)) {
    return { valid: false, message: 'Name cannot have consecutive spaces.' }
  }
  if (!nameRegex.test(name)) {
    return { valid: false, message: 'Name can only contain letters, spaces, and ñ/Ñ.' }
  }
  return { valid: true, message: '' }
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
  if (username.length < 5)
    return { valid: false, message: 'Username must be at least 4 characters.' }
  if (username.length > 50)
    return { valid: false, message: 'Username must be less than 30 characters.' }

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

export function validateStreet(street: string): { valid: boolean; message: string } {
  if (isEmpty(street)) {
    return { valid: false, message: 'Street is required' }
  }
  if (street.length < 5) return { valid: false, message: 'Street must be at least 4 characters.' }
  if (street.length > 50)
    return { valid: false, message: 'Street must be less than 30 characters.' }
  if (!streetRegex.test(street))
    return { valid: false, message: 'Street can only contain letters, numbers, spaces, and ñ/Ñ.' }
  if (hasLeadingOrTrailingWhitespace(street)) {
    return { valid: false, message: 'Street cannot have leading or trailing spaces.' }
  }
  if (hasConsecutiveSpaces(street)) {
    return { valid: false, message: 'Street cannot have consecutive spaces.' }
  }
  return { valid: true, message: '' }
}

export function validateCity(city: string): { valid: boolean; message: string } {
  if (isEmpty(city)) {
    return { valid: false, message: 'City is required' }
  }
  if (city.length < 5) return { valid: false, message: 'City must be at least 4 characters.' }
  if (city.length > 50) return { valid: false, message: 'City must be less than 30 characters.' }
  if (!cityRegex.test(city))
    return { valid: false, message: 'City can only contain letters, spaces, and ñ/Ñ.' }
  if (hasLeadingOrTrailingWhitespace(city)) {
    return { valid: false, message: 'City cannot have leading or trailing spaces.' }
  }
  if (hasConsecutiveSpaces(city)) {
    return { valid: false, message: 'City cannot have consecutive spaces.' }
  }
  return { valid: true, message: '' }
}
