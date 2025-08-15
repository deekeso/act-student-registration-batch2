<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import UserCard from '@/components/UserCard.vue'
import TableUser from '@/components/TableUser.vue'
import AddUserDrawer from '@/components/AddUserDrawer.vue'
import { ElLoading } from 'element-plus'
import ActionCard from '@/components/ActionCard.vue'
import dayjs from 'dayjs'

const userStore = useUserStore()
const showAddDrawer = ref(false)
const loading = ref(true)
const showActions = ref(false)
const view = ref('Grid')
const viewOptions = ['Grid', 'Table']

const handleRefresh = () => {
  location.reload()
}

onBeforeMount(async () => {
  console.log(' onBeforeMount triggered, fetching users')

  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading users...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  // Fetch users
  await userStore.getUsers()

  // Close loading
  loadingInstance.close()
  loading.value = false
})

onMounted(async () => {
  console.log('onMount triggered, adding createdAt')

  userStore.user = userStore.user.map((user) => ({
    ...user,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  }))
})

onBeforeUnmount(() => {
  console.log(' onBeforeUnmount triggered')
})
</script>

<template>
  <section id="list">
    <div class="actions-container">
      <div class="actions-left">
        <h2 class="page-title">Users</h2>
      </div>

      <div class="actions-right">
        <div class="action-buttons">
          <el-button class="action-btn refresh-btn" @click="handleRefresh" plain>
            <el-icon><RefreshRight /></el-icon>
            Refresh
          </el-button>

          <el-button class="action-btn manage-btn" @click="showActions = true">
            <el-icon><Operation /></el-icon>
            Manage
          </el-button>
        </div>

        <div class="view-toggle">
          <p>List View</p>
          <el-segmented v-model="view" :options="viewOptions" size="default" />
        </div>
      </div>
    </div>

    <div class="content-area">
      <div v-if="view === 'Grid'" class="grid-view">
        <UserCard v-if="!loading" />
      </div>
      <div v-if="view === 'Table'" class="table-view">
        <TableUser v-if="!loading" />
      </div>
    </div>
  </section>

  <AddUserDrawer v-model:visible="showAddDrawer" />
  <ActionCard v-if="showActions" v-model:visible="showActions" />
</template>

<style scoped>
#list {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

.actions-container {
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.user-count {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.actions-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  height: 40px;
  padding: 0 16px;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.view-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-left: 1px solid #e5e7eb;
}

.content-area {
  border-radius: 12px;
  min-height: 500px;
  overflow: hidden;
}

.grid-view {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.table-view {
  padding: 0;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  #list {
    padding: 12px;
  }

  .actions-container {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    gap: 16px;
  }

  .actions-left {
    justify-content: center;
  }

  .actions-right {
    flex-direction: column;
    gap: 12px;
  }

  .action-buttons {
    justify-content: center;
  }

  .view-toggle {
    padding-left: 0;
    border-left: none;
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    display: flex;
    justify-content: center;
  }

  .page-title {
    font-size: 20px;
  }

  .grid-view {
    padding: 16px;
  }
}
</style>
