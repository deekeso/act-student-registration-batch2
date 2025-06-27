<template>
  <el-drawer
    v-if="isMobile"
    v-model="internalVisible"
    :direction="direction"
    :before-close="handleClose"
    size="100%"
    style="
      border-radius: 10px;
      border-left: 20px solid #1a3a9a;
      border-right: 5px solid #e0e0e0;
      height: 100vh;
    "
  >
    <template #header>
      <slot name="header">
        <h4 style="font-size: 24px; font-weight: 700; color: #1a3a9a; width: 100%">
          {{ title }}
        </h4>
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
  <el-drawer
    v-else
    v-model="internalVisible"
    :direction="direction"
    :before-close="handleClose"
    size="30%"
    style="
      border-radius: 10px;
      border-left: 20px solid #1a3a9a;
      border-right: 5px solid #e0e0e0;
      height: 100vh;
    "
  >
    <template #header>
      <slot name="header">
        <h4 style="font-size: 24px; font-weight: 700; color: #1a3a9a; width: 100%">
          {{ title }}
        </h4>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'

// Define props for the drawer
const props = defineProps<{
  modelValue: boolean
  title?: string
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  showFooter?: boolean
}>()

// Define emits for the drawer
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Define state for the drawer
const internalVisible = ref(props.modelValue)

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  (val) => {
    internalVisible.value = val
  },
)

// Watch for changes in the internalVisible state
watch(internalVisible, (val) => {
  emit('update:modelValue', val)
})

// Handle close event
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => done())
    .catch(() => {})
}

// Called when user cancels the drawer
function onCancel() {
  emit('cancel')
  internalVisible.value = false
}

// Called when user confirms the drawer
function onConfirm() {
  emit('confirm')
}

const isMobile = ref(window.innerWidth <= 1100)

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 1100
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  updateIsMobile()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>
<style scoped>
.el-drawer__header {
  margin-bottom: 0 !important;
}
</style>
