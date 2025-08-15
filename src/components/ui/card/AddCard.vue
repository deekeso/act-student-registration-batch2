<template>
  <el-dialog
    :model-value="props.visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    title="Add user"
    class="add-user-dialog"
    width="500px"
    align-center
  >
    <el-form label-position="top" class="add-user-form">
      <div class="form-grid">
        <el-form-item label="Name" prop="name" :error="errors.name" class="form-item">
          <el-input
            v-model="addUserForm.name"
            minlength="6"
            maxlength="50"
            show-word-limit
            placeholder="Enter full name"
            @keyup.enter="handleAddSubmit"
          />
        </el-form-item>

        <el-form-item label="Username" prop="username" :error="errors.username" class="form-item">
          <el-input
            v-model="addUserForm.username"
            minlength="4"
            maxlength="30"
            show-word-limit
            placeholder="Enter username"
            @keyup.enter="handleAddSubmit"
          />
        </el-form-item>

        <el-form-item label="Email" prop="email" :error="errors.email" class="form-item full-width">
          <el-input
            v-model="addUserForm.email"
            placeholder="Enter email address"
            @keyup.enter="handleAddSubmit"
          />
        </el-form-item>

        <el-form-item
          label="Street"
          prop="street"
          :error="errors.address?.street"
          class="form-item"
        >
          <el-input
            v-model="addUserForm.address.street"
            minlength="4"
            maxlength="30"
            show-word-limit
            placeholder="Enter street address"
            @keyup.enter="handleAddSubmit"
          />
        </el-form-item>

        <el-form-item label="City" prop="city" :error="errors.address?.city" class="form-item">
          <el-input
            v-model="addUserForm.address.city"
            minlength="4"
            maxlength="30"
            show-word-limit
            placeholder="Enter city"
            @keyup.enter="handleAddSubmit"
          />
        </el-form-item>
      </div>

      <div class="form-actions">
        <el-button type="info" @click="handleCancel" class="cancel-btn"> Cancel </el-button>
        <el-button type="primary" @click="handleAddSubmit" class="submit-btn"> Add </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { NewUser } from '@/types/user'
import { formValidation, type UserData } from '@/utils/formValidation'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import type z from 'zod'

const addUserForm = reactive<UserData>({
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    city: '',
  },
})

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'addUser', user: NewUser): void
}>()

const errors = reactive<{
  name?: string
  username?: string
  email?: string
  address?: {
    street?: string
    city?: string
  }
}>({})

const handleAddSubmit = async () => {
  const result = formValidation.safeParse(addUserForm)

  Object.keys(errors).forEach((key) => delete errors[key as keyof typeof errors])

  if (!result.success) {
    const zodError = result.error as z.ZodError<UserData>
    zodError.issues.forEach((issue) => {
      if (issue.path.length > 1) {
        const [parent, child] = issue.path
        if (parent === 'address') {
          if (!errors.address) errors.address = {}
          errors.address[child as 'street' | 'city'] = issue.message
        }
      } else {
        const field = issue.path[0] as keyof UserData
        errors[field] = issue.message
      }
    })

    ElMessage.warning('Please correct the form errors before submitting.')
    return
  }

  try {
    const newUser = {
      ...addUserForm,
      createdAt: dayjs().format('YYYY-MM-DD'),
    }

    emit('addUser', newUser)

    ElMessage.success('User added successfully!')
    console.log('New user:', newUser)

    emit('update:visible', false)

    // clear form
    addUserForm.name = ''
    addUserForm.username = ''
    addUserForm.email = ''
    addUserForm.address.street = ''
    addUserForm.address.city = ''
  } catch (error) {
    console.error(error)
    ElMessage.error('Failed to add user.')
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('You have unsaved changes, proceed?', 'Confirm', {
      confirmButtonText: 'Discard Changes',
      cancelButtonText: 'Stay',
      type: 'warning',
    })

    // User clicked "Discard Changes"
    ElMessage({
      type: 'info',
      message: 'Changes discarded. Closing form.',
    })

    // Clear form
    addUserForm.name = ''
    addUserForm.username = ''
    addUserForm.email = ''
    addUserForm.address.street = ''
    addUserForm.address.city = ''

    emit('update:visible', false)
  } catch {
    // User clicked "Stay" (cancel)
    ElMessage({
      type: 'info',
      message: 'Stayed on the form.',
    })
  }
}
</script>

<style scoped>
/* Form Styling */
.add-user-form {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
  margin-bottom: 2rem;
}

.form-item {
  margin-bottom: 4;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

/* Form Item Labels */
:deep(.form-item .el-form-item__label) {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  line-height: 1.25rem;
}

/* Input Styling */
:deep(.form-item .el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.form-item .el-input__wrapper:hover) {
  border-color: #5e87f5;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(94, 135, 245, 0.1);
}

:deep(.form-item .el-input__wrapper.is-focus) {
  border-color: #5e87f5;
  box-shadow: 0 0 0 3px rgba(94, 135, 245, 0.1);
}

:deep(.form-item .el-input__inner) {
  color: #374151;
  font-size: 0.875rem;
}

:deep(.form-item .el-input__inner::placeholder) {
  color: #9ca3af;
}

/* Word Limit Styling */
:deep(.form-item .el-input__count) {
  color: #6b7280;
  font-size: 0.75rem;
}

/* Error Styling */
:deep(.form-item.is-error .el-input__wrapper) {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

:deep(.form-item .el-form-item__error) {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Action Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.cancel-btn,
.submit-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.submit-btn {
  background: #5e87f5;
  border-color: #5e87f5;
}

.submit-btn:hover {
  background: #4c6ef5;
  border-color: #4c6ef5;
}

/* Responsive Design */
@media (max-width: 768px) {
  :deep(.add-user-dialog) {
    width: 95vw !important;
    margin: 0;
  }

  :deep(.add-user-dialog .el-dialog__header) {
    padding: 1.25rem 1.5rem;
  }

  :deep(.add-user-dialog .el-dialog__body) {
    padding: 1.5rem;
  }

  .add-user-form {
    padding: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-item.full-width {
    grid-column: 1;
  }

  .form-actions {
    flex-direction: row;
    gap: 0.75rem;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  :deep(.add-user-dialog .el-dialog__header) {
    padding: 1rem 1.25rem;
  }

  :deep(.add-user-dialog .el-dialog__body) {
    padding: 1.25rem;
  }

  .add-user-form {
    padding: 1rem;
  }

  .form-grid {
    gap: 0.75rem;
  }
}
</style>
