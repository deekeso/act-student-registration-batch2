// --- Input Filters ---
export function numberOnly(e: KeyboardEvent) {
  const char = e.key;
  if (!/[0-9]/.test(char)) e.preventDefault();
}

export function lettersOnly(e: KeyboardEvent) {
  // Letters, space, ñ, Ñ
  const char = e.key;
  if (!/[a-zA-Z ñÑ]/.test(char)) e.preventDefault();
}

export function lettersNumbersOnly(e: KeyboardEvent) {
  // Letters, numbers, space, ñ, Ñ
  const char = e.key;
  if (!/[a-zA-Z0-9 ñÑ]/.test(char)) e.preventDefault();
}

// --- Validation Functions ---

// Contact Number: +63 is leading, require 10 digits after, starts with 9.
export function validateContactNumber(contactNumber: number): { valid: boolean; message: string } {
  const regex = /^9\d{9}$/;
  if (!contactNumber) {
    return { valid: false, message: 'Contact number is required.' };
  }
  if (!regex.test(contactNumber.toString())) {
    return { valid: false, message: 'Contact number must start with 9 and be exactly 10 digits.' };
  }
  return { valid: true, message: '' };
}

// Name fields: Letters only, max 50 chars, min 2 (last/first), min 1 (middle), no leading/trailing/consecutive spaces, allow ñ/Ñ
const nameRegex = /^[a-zA-Z ñÑ]+(?: [a-zA-Z ñÑ]+)*$/;

function hasLeadingOrTrailingWhitespace(value: string): boolean {
  return /^\s|\s$/.test(value);
}
function hasConsecutiveSpaces(value: string): boolean {
  return / {2,}/.test(value);
}

export function validateLastName(lastName: string): { valid: boolean; message: string } {
  if (!lastName || lastName.length < 2) {
    return { valid: false, message: 'Last name must be at least 2 characters.' };
  }
  if (lastName.length > 30) {
    return { valid: false, message: 'Last name must be less than 30 characters.' };
  }
  if (hasLeadingOrTrailingWhitespace(lastName)) {
    return { valid: false, message: 'Last name cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(lastName)) {
    return { valid: false, message: 'Last name cannot have consecutive spaces.' };
  }
  if (!nameRegex.test(lastName)) {
    return { valid: false, message: 'Last name can only contain letters, spaces, and ñ/Ñ.' };
  }
  return { valid: true, message: '' };
}

export function validateFirstName(firstName: string): { valid: boolean; message: string } {
  if (!firstName || firstName.length < 2) {
    return { valid: false, message: 'First name must be at least 2 characters.' };
  }
  if (firstName.length > 30) {
    return { valid: false, message: 'First name must be less than 30 characters.' };
  }
  if (hasLeadingOrTrailingWhitespace(firstName)) {
    return { valid: false, message: 'First name cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(firstName)) {
    return { valid: false, message: 'First name cannot have consecutive spaces.' };
  }
  if (!nameRegex.test(firstName)) {
    return { valid: false, message: 'First name can only contain letters, spaces, and ñ/Ñ.' };
  }
  return { valid: true, message: '' };
}

export function validateMiddleName(middleName: string): { valid: boolean; message: string } {
  if (!middleName) return { valid: true, message: '' };
  if (middleName.length < 2) {
    return { valid: false, message: 'Middle name must be at least 2 characters.' };
  }
  if (middleName.length > 30) {
    return { valid: false, message: 'Middle name must be less than 30 characters.' };
  }
  if (hasLeadingOrTrailingWhitespace(middleName)) {
    return { valid: false, message: 'Middle name cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(middleName)) {
    return { valid: false, message: 'Middle name cannot have consecutive spaces.' };
  }
  if (!nameRegex.test(middleName)) {
    return { valid: false, message: 'Middle name can only contain letters, spaces, and ñ/Ñ.' };
  }
  return { valid: true, message: '' };
}

// Birthday: must be 18 to 100 years old
export function validateBirthday(birthDate: string): { valid: boolean; message: string } {
  if (!birthDate) return { valid: false, message: 'Birthday is required.' };
  const date = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  if (age < 18) return { valid: false, message: 'You must be at least 18 years old.' };
  if (age > 100) return { valid: false, message: 'You must be younger than 100 years old.' };
  return { valid: true, message: '' };
}

// Address fields: street & barangay - letters/numbers/space/ñ/Ñ, min 5, max 50
const addressRegex = /^[a-zA-Z0-9 ñÑ]+(?: [a-zA-Z0-9 ñÑ]+)*$/;
export function validateStreet(street: string): { valid: boolean; message: string } {
  if (!street || street.length < 5) return { valid: false, message: 'Street must be at least 5 characters.' };
  if (street.length > 50) return { valid: false, message: 'Street must be less than 50 characters.' };
  if (!addressRegex.test(street)) return { valid: false, message: 'Street can only contain letters, numbers, spaces, and ñ/Ñ.' };
  if (hasLeadingOrTrailingWhitespace(street)) {
    return { valid: false, message: 'Street cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(street)) {
    return { valid: false, message: 'Street cannot have consecutive spaces.' };
  }
  return { valid: true, message: '' };
}
export function validateBarangay(barangay: string): { valid: boolean; message: string } {
  if (!barangay || barangay.length < 5) return { valid: false, message: 'Barangay must be at least 5 characters.' };
  if (barangay.length > 50) return { valid: false, message: 'Barangay must be less than 50 characters.' };
  if (!addressRegex.test(barangay)) return { valid: false, message: 'Barangay can only contain letters, numbers, spaces, and ñ/Ñ.' };
  if (hasLeadingOrTrailingWhitespace(barangay)) {
    return { valid: false, message: 'Barangay cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(barangay)) {
    return { valid: false, message: 'Barangay cannot have consecutive spaces.' };
  }
  return { valid: true, message: '' };
}

// City: letters only (and space/ñ/Ñ), min 5, max 50
const cityRegex = /^[a-zA-Z ñÑ]+$/;
export function validateCity(city: string): { valid: boolean; message: string } {
  if (!city || city.length < 5) return { valid: false, message: 'City must be at least 5 characters.' };
  if (city.length > 50) return { valid: false, message: 'City must be less than 50 characters.' };
  if (!cityRegex.test(city)) return { valid: false, message: 'City can only contain letters, spaces, and ñ/Ñ.' };
  if (hasLeadingOrTrailingWhitespace(city)) {
    return { valid: false, message: 'City cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(city)) {
    return { valid: false, message: 'City cannot have consecutive spaces.' };
  }
  return { valid: true, message: '' };
}

// Province: letters only (and space/ñ/Ñ), min 5, max 50
export function validateProvince(province: string): { valid: boolean; message: string } {
  if (!province || province.length < 5) return { valid: false, message: 'Province must be at least 5 characters.' };
  if (province.length > 50) return { valid: false, message: 'Province must be less than 50 characters.' };
  if (!cityRegex.test(province)) return { valid: false, message: 'Province can only contain letters, spaces, and ñ/Ñ.' };
  if (hasLeadingOrTrailingWhitespace(province)) {
    return { valid: false, message: 'Province cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(province)) {
    return { valid: false, message: 'Province cannot have consecutive spaces.' };
  }
  return { valid: true, message: '' };
}

// Zip Code: numbers only, 4 or 5 digits
export function validateZipCode(zipCode: string | number): { valid: boolean; message: string } {
  const zipStr = zipCode.toString();
  if (!zipStr) return { valid: false, message: 'Zip Code is required.' };
  if (!/^\d+$/.test(zipStr)) return { valid: false, message: 'Zip Code can only contain numbers.' };
  if (zipStr.length < 4) return { valid: false, message: 'Zip Code must be 4 digits.' };
  return { valid: true, message: '' };
}

// Landmark: optional, min 5, max 50
export function validateLandmark(landmark: string): { valid: boolean; message: string } {
  if (!landmark || landmark.length < 5) return { valid: false, message: 'Landmark must be at least 5 characters.' };
  if (landmark.length > 50) return { valid: false, message: 'Landmark must be less than 50 characters.' };
  if (hasLeadingOrTrailingWhitespace(landmark)) {
    return { valid: false, message: 'Landmark cannot have leading or trailing spaces.' };
  }
  if (hasConsecutiveSpaces(landmark)) {
    return { valid: false, message: 'Landmark cannot have consecutive spaces.' };
  }
  return { valid: true, message: '' };
}
