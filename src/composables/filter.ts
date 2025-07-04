import { computed, type Ref } from 'vue'
import type { Student } from '../types/Students'

export const useSearchFilter = (students: Ref<Student[]>, searchQuery: Ref<string>) => {
  // Function to normalize text
  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ')
  }

  // Search filter logic
  const filteredStudents = computed(() => {
    if (!searchQuery.value) {
      return students.value
    }

    const query = normalizeText(searchQuery.value)
    const queryWords = query.split(' ').filter((word) => word.length > 0)

    return students.value.filter((student) => {
      // Pre-compute all normalized values once
      const normalizedFields = {
        firstName: normalizeText(student.firstName),
        lastName: normalizeText(student.lastName),
        middleInitial: normalizeText(student.middleInitial),
        streetAddress: normalizeText(student.streetAddress),
        barangay: normalizeText(student.barangay),
        city: normalizeText(student.city),
        province: normalizeText(student.province),
        zipCode: normalizeText(student.zipCode),
      }

      // Create full name variations
      const fullName =
        `${normalizedFields.firstName} ${normalizedFields.middleInitial} ${normalizedFields.lastName}`.trim()
      const fullNameReversed = `${normalizedFields.lastName} ${normalizedFields.firstName}`

      // Check exact query match first (most common case)
      if (
        normalizedFields.firstName.includes(query) ||
        normalizedFields.lastName.includes(query) ||
        normalizedFields.middleInitial.includes(query) ||
        fullName.includes(query) ||
        fullNameReversed.includes(query) ||
        normalizedFields.streetAddress.includes(query) ||
        normalizedFields.barangay.includes(query) ||
        normalizedFields.city.includes(query) ||
        normalizedFields.province.includes(query) ||
        normalizedFields.zipCode.includes(query)
      ) {
        return true
      }

      // If no exact match and query has multiple words, check word-by-word
      if (queryWords.length > 1) {
        return queryWords.every(
          (word) =>
            normalizedFields.firstName.includes(word) ||
            normalizedFields.lastName.includes(word) ||
            normalizedFields.middleInitial.includes(word) ||
            normalizedFields.streetAddress.includes(word) ||
            normalizedFields.barangay.includes(word) ||
            normalizedFields.city.includes(word) ||
            normalizedFields.province.includes(word),
        )
      }

      return false
    })
  })

  return {
    filteredStudents,
  }
}
