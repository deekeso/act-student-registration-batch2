<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import AddUserDrawer from './AddUserDrawer.vue'
import { useUserStore } from '@/stores/userStore'
import EditUserDrawer from './EditUserDrawer.vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible'])
const userStore = useUserStore()
const showEditDrawer = ref(false)
const showAddDrawer = ref(false)

const userId = ref<number | null>(null)

const showDialog = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const validateUserId = () => {
  if (!userId.value) return false
  const exists = userStore.user.some((u) => u.id === userId.value)
  if (!exists) {
    ElMessage.error(`User Id with ${userId.value} not found!`)
    return false
  }
  return true
}

onUnmounted(() => {
  console.log('Dialog component destroyed')
})
</script>

<template>
  <el-dialog
    v-model="showDialog"
    title="Actions"
    style="width: 400px"
    draggable
    align-center
    destroy-on-close
  >
    <div class="container">
      <el-input-number style="width: 100%" :min="0" v-model="userId" placeholder="Id" clearable />
      <div class="actions">
        <el-button @click="showAddDrawer = true">Add</el-button>
        <el-button
          :disabled="!userId"
          @click="
            () => {
              if (!validateUserId) return
              showEditDrawer = true
              console.log('userid found')
            }
          "
          >Edit</el-button
        >
        <el-button
          @click="
            () => {
              if (!validateUserId()) return
              userStore.deleteUser(userId as number)
            }
          "
          >Delete</el-button
        >
      </div>
    </div>
  </el-dialog>

  <AddUserDrawer v-model:visible="showAddDrawer" @success="emit('update:visible', false)" />
  <EditUserDrawer
    v-model:visible="showEditDrawer"
    :user-id="userId"
    @success="emit('update:visible', false)"
  />
</template>

<style scoped>
:deep(.el-button) {
  margin-left: 0 !important;
  width: 100%;
}

.container {
  min-height: 100%;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 10px;
}
</style>
