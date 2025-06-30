<template>
  <!-- Student form drawer component, title depends if student exists via ID -->
  <el-drawer
    v-model="drawerVisible"
    :title="studentId ? 'Edit Student' : 'Add New Student'"
    :size="drawerSize"
    :before-close="handleClose"
    destroy-on-close
    class="student-drawer"
  >
    <template #default>
      <!-- Student form component, submit button dependent on existing studentID -->
      <student-form
        :student-id="studentId"
        :submit-button-text="studentId ? 'Update' : 'Add Student'"
        @submit-success="handleSubmitSuccess"
        @cancel="handleClose"
      />
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import StudentForm from './StudentForm.vue'

// Props for drawer visibility and student ID
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  studentId: {
    type: Number,
    default: null,
  },
})

// Emits for drawer close and student saved events
const emit = defineEmits(['close', 'student-saved'])

// Computed property to handle drawer visibility
const drawerVisible = computed({
  get: () => props.isOpen,
  set: (value) => {
    if (!value) {
      emit('close')
    }
  },
})

// Responsive drawer size based on screen width
const drawerSize = ref(getDrawerSize())

function getDrawerSize() {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768 ? '90%' : 
           window.innerWidth <= 1024 ? '60%' : '40%'
  }
  return '30%' // Default fallback
}

// Update drawer size on window resize
function handleResize() {
  drawerSize.value = getDrawerSize()
}

// Set up and clean up resize event listener
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Handle drawer close event
const handleClose = () => {
  emit('close')
}

// Handle student saved event
const handleSubmitSuccess = () => {
  emit('student-saved')
  emit('close')
}
</script>

<style scoped>
.student-drawer {
  width: 30%;
}

:deep(.el-drawer__header) {
  margin-bottom: 20px;
  font-weight: bold !important;
  color: var(--primary-color);
  padding: 16px 20px;
}

:deep(.el-drawer__body) {
  padding: 0 20px;
  overflow-y: auto;
  height: calc(100% - 60px); /* Account for header height */
}

:deep(.el-drawer__title) {
  font-size: 18px;
}

@media (max-width: 576px) {
  :deep(.el-drawer) {
    width: 100% !important;
  }
  
  :deep(.el-drawer__header) {
    padding: 12px 16px;
  }
  
  :deep(.el-drawer__body) {
    padding: 0 16px;
  }
  
  :deep(.el-drawer__title) {
    font-size: 16px;
  }
}
</style>
