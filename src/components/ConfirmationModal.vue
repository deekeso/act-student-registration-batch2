<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
    :show-close="true"
    width="50%"
    @close="handleClose"
  >
    <span>{{ message }}</span>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="danger" @click="handleConfirm">
          {{ confirmButtonText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Generic confirmation modal component, reusable for any confirmation dialog
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed with this action?',
  },
  confirmButtonText: {
    type: String,
    default: 'Confirm',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

// Computed property to handle dialog visibility
const dialogVisible = computed({
  get: () => props.show,
  set: (value) => {
    if (!value) {
      emit('cancel')
    }
  },
})

const handleConfirm = () => {
  emit('confirm')
  // Set to false after emitting to ensure the parent component receives the event
  dialogVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
}

const handleClose = () => {
  emit('cancel')
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  width: 100%;
}

@media (max-width: 576px) {
  :deep(.el-dialog) {
    width: 100% !important;
    height: 100% !important;
  }

  .dialog-footer {
    flex-direction: column-reverse;
  }

  .dialog-footer .el-button {
    width: 100%;
    margin: 0 !important;
  }
}
</style>
