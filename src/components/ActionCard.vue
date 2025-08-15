<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import AddUserDrawer from './AddUserDrawer.vue'
import { useUserStore } from '@/stores/userStore'
import EditUserDrawer from './EditUserDrawer.vue'
import { ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'

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
  console.log(userId)

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
    title="Manage The User List"
    style="width: 400px"
    draggable
    align-center
    destroy-on-close
  >
    <div class="container">
      <el-input-number
        style="width: 100%"
        :min="0"
        v-model="userId"
        placeholder="Select an Id to modify or delete"
        clearable
      />
      <div class="actions">
        <span>
          <el-button
            class="act-btn"
            :disabled="!userId"
            :icon="Edit"
            @click="
              () => {
                if (!validateUserId()) return
                showEditDrawer = true
                console.log('userid found')
              }
            "
            >Edit</el-button
          >
          <el-button
            class="act-btn"
            :disabled="!userId"
            :icon="Delete"
            @click="
              () => {
                if (!validateUserId()) return
                userStore.deleteUser(userId as number)
              }
            "
            >Delete</el-button
          >
        </span>
        <el-button @click="showAddDrawer = true">Add</el-button>
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
  /* margin-left: 0 !important; */
  width: 100%;
}

.container {
  min-height: 100%;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
  align-items: center;
}

.act-btn {
  width: 170px;
}
</style>
