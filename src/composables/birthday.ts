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
    const minDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate() + 1)
    return date > minDate
  }
  return { disabledDate }
}

export function formatDate(date: string | Date) {
  if (!date) return ''
  const d = new Date(date)
  // Format as YYYY-MM-DD
  return d.toISOString().split('T')[0]
}

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
