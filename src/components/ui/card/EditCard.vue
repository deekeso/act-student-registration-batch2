<template>
  <el-dialog
    :model-value="props.visible"
    @update:model-value="$emit('update:visible', $event)"
    :show-close="false"
    title="Edit User"
    class="edit-user-dialog"
    width="500px"
    align-center
  >
    <el-form label-position="top" class="edit-user-form">
      <div class="form-grid">
        <el-form-item label="Name" prop="name" :error="errors.name" class="form-item">
          <el-input
            v-model="editUserForm.name"
            minlength="6"
            maxlength="50"
            show-word-limit
            placeholder="Enter full name"
            @keyup.enter="handleEditSubmit"
          />
        </el-form-item>

        <el-form-item label="Username" prop="username" :error="errors.username" class="form-item">
          <el-input
            v-model="editUserForm.username"
            minlength="4"
            maxlength="30"
            show-word-limit
            placeholder="Enter username"
            @keyup.enter="handleEditSubmit"
          />
        </el-form-item>

        <el-form-item label="Email" prop="email" :error="errors.email" class="form-item full-width">
          <el-input
            v-model="editUserForm.email"
            placeholder="Enter email address"
            @keyup.enter="handleEditSubmit"
          />
        </el-form-item>

        <el-form-item
          label="Street"
          prop="street"
          :error="errors.address?.street"
          class="form-item"
        >
          <el-input
            v-model="editUserForm.address.street"
            minlength="4"
            maxlength="30"
            show-word-limit
            placeholder="Enter street address"
            @keyup.enter="handleEditSubmit"
          />
        </el-form-item>

        <el-form-item label="City" prop="city" :error="errors.address?.city" class="form-item">
          <el-input
            v-model="editUserForm.address.city"
            minlength="4"
            maxlength="30"
            show-word-limit
            placeholder="Enter city"
            @keyup.enter="handleEditSubmit"
          />
        </el-form-item>
      </div>

      <div class="form-actions">
        <div class="primary-actions">
          <el-button type="info" @click="handleCancel" class="cancel-btn"> Cancel </el-button>
          <el-button type="primary" @click="handleEditSubmit" class="submit-btn">
            Update
          </el-button>
        </div>
        <div class="danger-actions">
          <el-button
            link
            @click="handleDeleteUser(user!.id)"
            class="delete-btn"
            title="Delete user"
          >
            <el-icon :size="16" color="red"><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User } from '@/types/user'
import { formValidation, type UserData } from '@/utils/formValidation'
import type z from 'zod'
import { Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{
  visible: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'updateUser', user: User): void
}>()

const initialUserCopy = ref<User | null>(null)
const userStore = useUserStore()

// Reactive form
const editUserForm = reactive<UserData>({
  name: '',
  username: '',
  email: '',
  address: {
    street: '',
    city: '',
  },
})

// Sync prop.user → form
watch(
  () => props.user,
  (user) => {
    if (user) {
      // Deep copy for reset
      initialUserCopy.value = JSON.parse(JSON.stringify(user))

      editUserForm.name = user.name
      editUserForm.username = user.username
      editUserForm.email = user.email
      editUserForm.address.street = user.address.street
      editUserForm.address.city = user.address.city
    }
    console.log('Edit user:', props.user)
  },
  { immediate: true },
)

const errors = reactive<{
  name?: string
  username?: string
  email?: string
  address?: {
    street?: string
    city?: string
  }
}>({})

const handleEditSubmit = async () => {
  const result = formValidation.safeParse(editUserForm)

  Object.keys(errors).forEach((key) => delete errors[key as keyof UserData])

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
    return
  }

  try {
    if (!props.user) return

    const updatedUser: User = {
      ...props.user,
      name: editUserForm.name,
      username: editUserForm.username,
      email: editUserForm.email,
      address: {
        ...props.user.address,
        street: editUserForm.address.street,
        city: editUserForm.address.city,
      },
    }

    emit('updateUser', updatedUser)
    ElMessage.success('User updated successfully!')
    console.log('Updated user:', updatedUser)

    emit('update:visible', false)
  } catch (error) {
    console.error(error)
    ElMessage.error('Failed to update user.')
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('You have unsaved changes, proceed?', 'Confirm', {
      confirmButtonText: 'Discard Changes',
      cancelButtonText: 'Stay',
      type: 'warning',
    })

    if (initialUserCopy.value) {
      editUserForm.name = initialUserCopy.value.name
      editUserForm.username = initialUserCopy.value.username
      editUserForm.email = initialUserCopy.value.email
      editUserForm.address.street = initialUserCopy.value.address.street
      editUserForm.address.city = initialUserCopy.value.address.city
    }

    ElMessage({
      type: 'info',
      message: 'Changes discarded. Closing form.',
    })

    emit('update:visible', false)
  } catch {
    ElMessage({
      type: 'info',
      message: 'Stayed on the form.',
    })
  }
}

async function handleDeleteUser(id: number) {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this user? This action cannot be undone.',
      'Delete User',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error',
      },
    )

    await userStore.removeUser(id)
    emit('update:visible', false)
    ElMessage.success('User deleted successfully!')
    console.log('Deleted user id:', id)
  } catch {
    ElMessage({
      type: 'info',
      message: 'Delete cancelled.',
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
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.primary-actions {
  display: flex;
  gap: 1rem;
}

.danger-actions {
  display: flex;
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
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background: #5e87f5;
  border-color: #5e87f5;
}

.submit-btn:hover {
  background: #4c6ef5;
  border-color: #4c6ef5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(94, 135, 245, 0.3);
}

.delete-btn {
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #991b1b;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
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
