import { ref, watch } from 'vue'

export const birthday = ref('')

export const disabledDate = (date: Date) => {
  return date > new Date()
}
/**
 * Returns a function to disable dates for users younger than 12 years old.
 */
export function useBirthdayPicker() {
  // Disable dates after today minus 12 years
  const disabledDate = (date: Date) => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1)
    return date > minDate
  }
  return { disabledDate }
}

export function formatDate(date: string | Date) {
  if (!date) return ''
  const d = new Date(date)

  // Handle timezone issues by using local date methods
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  // Format as YYYY-MM-DD
  return `${year}-${month}-${day}`
}

// Auto-calculate age based on birthday
export function useBirthdayAutoAge(state: { birthDate: string | Date; age: number | string }) {
  watch(
    () => state.birthDate,
    (newBirthDate) => {
      if (newBirthDate) {
        const birth = new Date(newBirthDate)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--
        }
        state.age = age
      } else {
        state.age = ''
      }
    },
  )
}

export const defaultBirthdayView = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
