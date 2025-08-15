<template>
  <el-dialog
    v-model="visible"
    :title="isEditing ? 'Edit Address' : 'Add New Address'"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      label-position="top"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="House Number" prop="houseNumber">
        <el-input
          v-model="formData.houseNumber"
          placeholder="e.g., House #123, Bldg 456"
          clearable
        />
      </el-form-item>

      <el-form-item label="Street Address" prop="street">
        <el-input
          v-model="formData.street"
          placeholder="e.g., Main Street, Brgy. Central"
          type="textarea"
          :rows="2"
          resize="none"
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="City" prop="city">
            <el-input v-model="formData.city" placeholder="e.g., Manila" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="State/Province" prop="state">
            <el-input v-model="formData.state" placeholder="e.g., Metro Manila" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="ZIP Code" prop="zipCode">
            <el-input v-model="formData.zipCode" placeholder="e.g., 1000" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Country" prop="country">
            <el-select v-model="formData.country" placeholder="Select Country" style="width: 100%">
              <el-option label="Philippines" value="Philippines" />
              <el-option label="United States" value="United States" />
              <el-option label="Canada" value="Canada" />
              <el-option label="Australia" value="Australia" />
              <el-option label="Singapore" value="Singapore" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-checkbox v-model="formData.isDefault"> Set as default address </el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ isEditing ? 'Update Address' : 'Add Address' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Address } from '@/types/api'

interface Props {
  modelValue: boolean
  address?: Address | null
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Omit<Address, 'id'>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  address: null,
  loading: false,
})

const emit = defineEmits<Emits>()

// Form reference
const formRef = ref<FormInstance>()

// Dialog visibility
const visible = ref(false)

// Check if we're editing
const isEditing = ref(false)

// Form data
const formData = reactive<Omit<Address, 'id'>>({
  houseNumber: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Philippines',
  isDefault: false,
})

// Custom validators
const validateNoNumbers = (rule: any, value: string, callback: any) => {
  if (!value) return callback()
  if (/\d/.test(value)) {
    return callback(new Error('Should not contain numbers'))
  }
  if (/^\s*$/.test(value)) {
    return callback(new Error('Cannot be just whitespace'))
  }
  callback()
}

const validateHouseNumber = (rule: any, value: string, callback: any) => {
  if (!value) return callback(new Error('House number is required'))
  if (value.length < 2) {
    return callback(new Error('Minimum 2 characters required'))
  }
  if (!/^[a-zA-Z0-9\s#\-.,]+$/.test(value)) {
    return callback(new Error('Only alphanumeric characters and #-., are allowed'))
  }
  callback()
}

// Form validation rules
const rules: FormRules = {
  houseNumber: [
    { required: true, message: 'House number is required', trigger: 'blur' },
    { validator: validateHouseNumber, trigger: 'blur' },
    { max: 100, message: 'Maximum 100 characters allowed', trigger: 'blur' },
  ],
  street: [
    { required: true, message: 'Street address is required', trigger: 'blur' },
    { 
      min: 5, 
      max: 200, 
      message: 'Street address must be between 5 and 200 characters', 
      trigger: 'blur' 
    },
    {
      pattern: /^[a-zA-Z0-9\s\-.,/#()]+$/,
      message: 'Only letters, numbers, spaces, and -.,/#() are allowed',
      trigger: 'blur'
    }
  ],
  city: [
    { required: true, message: 'City is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'City must be between 2 and 50 characters', trigger: 'blur' },
    { validator: validateNoNumbers, trigger: 'blur' },
    {
      pattern: /^[a-zA-Z\s\-()]+$/,
      message: 'Only letters, spaces, hyphens, and parentheses are allowed',
      trigger: 'blur'
    }
  ],
  state: [
    { required: true, message: 'State/Province is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'State/Province must be between 2 and 50 characters', trigger: 'blur' },
    { validator: validateNoNumbers, trigger: 'blur' },
    {
      pattern: /^[a-zA-Z\s\-()]+$/,
      message: 'Only letters, spaces, hyphens, and parentheses are allowed',
      trigger: 'blur'
    }
  ],
  zipCode: [
    { required: true, message: 'ZIP code is required', trigger: 'blur' },
    { 
      pattern: /^\d{4,10}$/, 
      message: 'ZIP code must be 4-10 digits', 
      trigger: 'blur' 
    }
  ],
  country: [
    { required: true, message: 'Country is required', trigger: 'change' }
  ]
}

// Watch for dialog visibility changes
watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
    if (newVal) {
      resetForm()
      if (props.address) {
        isEditing.value = true
        Object.assign(formData, {
          houseNumber: props.address.houseNumber,
          street: props.address.street,
          city: props.address.city,
          state: props.address.state,
          zipCode: props.address.zipCode,
          country: props.address.country,
          isDefault: props.address.isDefault,
        })
      } else {
        isEditing.value = false
      }
    }
  },
)

// Watch for dialog visibility to emit changes
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// Reset form
const resetForm = () => {
  if (formRef.value) {
    formRef.value.clearValidate()
  }

  Object.assign(formData, {
    houseNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Philippines',
    isDefault: false,
  })
}

// Handle form submission
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      const addressData = { ...formData }
      emit('submit', addressData)
    }
  } catch (error) {
    console.log('Form validation failed:', error)
  }
}

// Handle dialog close
const handleClose = () => {
  emit('cancel')
  visible.value = false
}

// Expose methods for parent component if needed
defineExpose({
  resetForm,
  validate: () => formRef.value?.validate(),
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
}

:deep(.el-dialog__body) {
  padding: 10px 20px 20px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

:deep(.el-input__wrapper) {
  transition: all 0.2s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-checkbox) {
  font-weight: 500;
}

:deep(.el-checkbox__label) {
  color: var(--el-text-color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 5vh auto;
  }

  .el-col {
    margin-bottom: 0;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
}
</style>
