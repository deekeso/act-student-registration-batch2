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
import ReusableDrawer from '/src/components/ui/drawer/ReusableDrawer.vue'
import AddForm from '/src/components/ui/forms/AddForm.vue'
import type { Students } from '/src/types/Students'

const props = defineProps<{
  modelValue: boolean
  title?: string
  initialData?: Partial<Students>
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Students): void
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
const handleFormSubmit = (data: Students) => {
  emit('submit', data)
  isOpen.value = false
}

// Handle form cancellation
const handleFormCancel = () => {
  emit('cancel')
  isOpen.value = false
}

// Handle drawer cancel (e.g., via close button)
const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<style scoped>
/* Add drawer-specific styles if needed */
</style>
