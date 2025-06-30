/**
 * Capitalize the first letter of the string
 * @param {any} value:string
 * @returns {string}
 */
export const capitalize = (value: string): string => {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

/**
 *  Capitalize each word of the string
 * @param {any} value:string
 * @returns {any}
 */
export const capitalizeEachWord = (value: string): string => {
  if(!value) return ''
  return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}