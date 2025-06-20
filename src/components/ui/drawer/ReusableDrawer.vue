<template>
  <el-drawer v-model="internalVisible" :direction="direction" :before-close="handleClose">
    <template #header>
      <slot name="header">
        <h4>{{ title }}</h4>
      </slot>
    </template>

    <template #default>
      <slot />
    </template>

    <template #footer v-if="showFooter">
      <slot name="footer">
        <div style="flex: auto">
          <el-button @click="onCancel">Cancel</el-button>
          <el-button type="primary" @click="onConfirm">Confirm</el-button>
        </div>
      </slot>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  title?: string
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  showFooter?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const internalVisible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    internalVisible.value = val
  },
)

watch(internalVisible, (val) => {
  emit('update:modelValue', val)
})

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => done())
    .catch(() => {})
}

function onCancel() {
  emit('cancel')
  internalVisible.value = false
}

function onConfirm() {
  emit('confirm')
}
</script>
