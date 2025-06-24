<template>
  <ReusableDrawer
    v-model="isOpen"
    :title="title"
    :direction="direction"
    :show-footer="false"
    @cancel="handleCancel"
  >
    <template #default>
      <AddForm :initial-data="initialData" @submit="handleFormSubmit" @cancel="handleFormCancel" />
    </template>
  </ReusableDrawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ReusableDrawer from '@/components/ui/drawer/ReusableDrawer.vue'
import AddForm from '@/components/ui/forms/AddForm.vue'
import type { Student } from '@/types/Students'

const props = defineProps<{
  modelValue: boolean
  title?: string
  initialData?: Partial<Student>
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Student): void
  (e: 'cancel'): void
}>()

// Default title if not provided
const title = ref(props.title || 'Add Student')
const isOpen = ref(props.modelValue)

// Sync isOpen with modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
  },
)

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

// Handle form submission
const handleFormSubmit = (data: Student) => {
  emit('submit', data) // Emit the data to the parent component
  isOpen.value = false // Close the drawer
}

// Handle form cancellation
const handleFormCancel = () => {
  emit('cancel')
  isOpen.value = false
}

// Handle drawer cancel
const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<style scoped>
/* Add drawer-specific styles if needed */
</style>
