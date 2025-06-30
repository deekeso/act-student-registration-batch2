/**
 *  Formats date to MM/DD/YYYY
 * @param {any} dateString:string
 * @returns {any}
 */
export function dateFormatter(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  if (isNaN(date.getTime())) return 'Invalid Date'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 *  Calculate the age 
 * @param {any} birthdateStr: string 
 * @returns {any}
 */
export function calculateAge(birthdateStr: string): number {
  const [month, day, year] = birthdateStr.split('/').map(Number)  // split the string into month day year
  const birthdate = new Date(year, month - 1, day) // month - 1 is needed because JavaScript's Date constructor uses zero-based months (January is 0, December is 11).
  const today = new Date() // Gets the current date and time

  let age = today.getFullYear() - birthdate.getFullYear() //calculates the difference in years
  
  //Checks if the birthday has already occurred this year
  const hasHadBirthdayThisYear =
    today.getMonth() > birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate())

  // If the birthday has not yet happened this year, subtracts 1
  if (!hasHadBirthdayThisYear) {
    age--
  }
  // return the age
  return age
}
