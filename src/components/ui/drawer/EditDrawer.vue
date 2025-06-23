<template>
  <ReusableDrawer
    v-model="isOpen"
    :title="title"
    :direction="direction"
    :show-footer="false"
    @cancel="handleCancel"
  >
    <template #default>
      <EditForm
        :key="editingStudent?.id || 'edit-form'"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
        @delete="handleFormDelete"
      />
    </template>
  </ReusableDrawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ReusableDrawer from '@/components/ui/drawer/ReusableDrawer.vue'
import EditForm from '@/components/ui/forms/EditForm.vue'
import type { Students } from '@/types/Students'

import { useStudentActions } from '@/composables/useStudentActions.ts'

const { editingStudent } = useStudentActions()

const props = defineProps<{
  modelValue: boolean
  title?: string
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Students): void
  (e: 'cancel'): void
  (e: 'delete', data: Students): void
}>()

const isOpen = ref(props.modelValue)
const title = ref(props.title ?? 'Edit Student')

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
  },
)

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleFormSubmit = (data: Students) => {
  emit('submit', data)
  isOpen.value = false
}

const handleFormCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const handleFormDelete = (data: Students) => {
  emit('delete', data)
  isOpen.value = false
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>

<style scoped></style>
