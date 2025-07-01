<template>
  <ReusableDrawer
    v-model="isOpen"
    :title="title"
    :direction="direction"
    :show-footer="false"
    @cancel="handleCancel"
  >
    <template #default>
      <!-- Pass editingStudent to EditForm -->
      <EditForm
        :key="(props.editingStudent?.id || '') + '-' + isOpen"
        :editing-student="props.editingStudent"
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
import type { Student } from '@/types/Students'
import { ElMessage } from 'element-plus'

// Define props for the drawer
const props = defineProps<{
  modelValue: boolean
  title?: string
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  editingStudent?: Student | null
}>()

// Define emits for the drawer
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Student): void
  (e: 'cancel'): void
  (e: 'delete', data: Student): void
}>()

// Define state for the drawer
const isOpen = ref(props.modelValue) // Drawer visibility state
const title = ref(props.title ?? 'Edit Student') // Drawer title

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
  },
)

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

// Called when user submits the form
const handleFormSubmit = (data: Student) => {
  emit('submit', data) // Emit the data to the parent component
  isOpen.value = false // Close the drawer
}

// Called when user cancels the form
const handleFormCancel = () => {
  emit('cancel') // Emit the cancel event to the parent component
  isOpen.value = false // Close the drawer
}

// Called when user deletes the student
const handleFormDelete = async (data: Student) => {
  ElMessage.success('Student deleted successfully!')
  emit('delete', data) // Emit the data to the parent component
  isOpen.value = false // Close the drawer
}

// Called when user cancels the drawer
const handleCancel = () => {
  emit('cancel') // Emit the cancel event to the parent component
  isOpen.value = false // Close the drawer
}
</script>

<style scoped></style>
