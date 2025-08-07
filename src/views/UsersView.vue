<!-- UsersView.vue -->
<template>
  <div class="user-view">
    <div class="user-view-header">
      <h1>Users</h1>
      <SearchBar :users="userStore.users" @select="handleSelect" />
      <div class="user-header-actions">
        <el-button @click="addCardVisible = true" title="Add user">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button @click="selectedUser = null" title="Reset list">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- VIEW OPTION -->
    <div class="view-toggle-container">
      <el-tabs v-model="view" class="view-toggle">
        <el-tab-pane label="Card View" name="card" />
        <el-tab-pane label="Table View" name="table" />
      </el-tabs>
    </div>

    <!-- LOADING -->
    <el-skeleton v-if="loading" animated>
      <template #template>
        <div class="user-list-card">
          <el-skeleton-item v-for="n in 10" :key="n" style="height: 180px; border-radius: 12px" />
        </div>
      </template>
    </el-skeleton>

    <!-- NO DATA -->
    <div v-else-if="filteredUsers.length === 0" class="no-users">
      <div class="no-users-content">
        <el-icon size="64" color="#cbd5e1"><Avatar /></el-icon>
        <h3>No users found</h3>
      </div>
    </div>

    <!-- CARD VIEW -->
    <div v-if="view === 'card' && !loading" class="user-list-card">
      <el-card v-for="user in filteredUsers" :key="user.id" class="user-card">
        <div class="user-card-header">
          <h3 class="user-name" :title="user.name">
            {{ user.name }}
          </h3>
          <div class="user-actions">
            <el-button
              link
              @click="handleViewUser(user.id)"
              title="View profile"
              class="action-btn"
            >
              <el-icon size="18px"><View /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="user-info">
          <div class="info-item" title="Username">
            <el-icon class="info-icon"><Avatar /></el-icon>
            <span class="info-text">{{ user.username }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- TABLE VIEW -->
    <div v-else-if="view === 'table' && filteredUsers.length !== 0" class="table-container">
      <el-table :data="filteredUsers" class="custom-table">
        <el-table-column prop="name" label="Name" min-width="120" />
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="username" label="Username" min-width="120" />
        <el-table-column label="Address" min-width="200">
          <template #default="{ row }"> {{ row.address.street }}, {{ row.address.city }} </template>
        </el-table-column>
        <el-table-column label="Actions" width="180" align="center">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button @click="handleEditUser(row)" link title="Edit user"
                ><el-icon color="#677ae5" size="16px"><EditPen /></el-icon
              ></el-button>
              <el-button @click="handleDeleteUser(row.id)" link title="Delete user"
                ><el-icon color="red" size="16px"><Delete /></el-icon
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <AddCard
      :visible="addCardVisible"
      @update:visible="addCardVisible = $event"
      @addUser="handleAddUser"
    />
    <EditCard
      :visible="editCardVisible"
      :user="selectedUser"
      @update:visible="editCardVisible = $event"
      @updateUser="handleUpdateUser"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { NewUser, User } from '@/types/user'
import AddCard from '@/components/ui/card/AddCard.vue'
import { ElMessage } from 'element-plus'
import { Avatar, Plus, Refresh, View, EditPen, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import EditCard from '@/components/ui/card/EditCard.vue'

const userStore = useUserStore()
const router = useRouter()
const loading = ref(true)
const view = ref<'card' | 'table'>('card')
const filteredUsers = computed(() =>
  selectedUser.value
    ? userStore.users.filter((u) => u.id === selectedUser.value?.id)
    : userStore.users,
)

onMounted(async () => {
  console.log('onMounted: Mounting User List')

  await userStore.fetchAllUsers()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  loading.value = false
})

const addCardVisible = ref(false)
const editCardVisible = ref(false)
const selectedUser = ref<User | null>(null)

function handleEditUser(user: User) {
  selectedUser.value = user
  editCardVisible.value = true
}

const handleUpdateUser = async (user: User) => {
  await userStore.editUser(user.id, user)
  editCardVisible.value = false
}

async function handleDeleteUser(id: number) {
  await userStore.removeUser(id)
  ElMessage.success('User deleted successfully!')
  console.log('Deleted user id:', id)
}

const handleAddUser = async (user: NewUser) => {
  await userStore.addUser(user)
  addCardVisible.value = false
}

function handleViewUser(id: number) {
  router.push(`/profile/${id}`)
}

function handleSelect(user: User) {
  selectedUser.value = user
}
</script>

<style scoped>
.user-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header Styles */
.user-view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  flex-wrap: nowrap;
}

.user-view-header h1 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.user-header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;
}

.user-header-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

.user-header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* View Toggle Styles */
.view-toggle-container {
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

:deep(.el-tabs__header) {
  margin-bottom: 16px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.el-tabs__nav-wrap) {
  padding: 0;
  width: 100%;
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
}

:deep(.el-tabs__item) {
  height: 44px;
  line-height: 44px;
  padding: 0 24px;
  margin-right: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #64748b;
  flex: 1;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
}

:deep(.el-tabs__item:last-child) {
  margin-right: 0;
}

:deep(.el-tabs__item.is-active) {
  color: #5e87f5;
  background: #f1f5ff;
}

:deep(.el-tabs__item:hover) {
  color: #5e87f5;
  background: #f8faff;
}

:deep(.el-tabs__active-bar) {
  display: none;
}
/* Empty State */
.no-users {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.no-users-content {
  text-align: center;
  padding: 3rem;
}

.no-users-content h3 {
  margin: 1.5rem 0 0.5rem;
  color: #374151;
  font-size: 1.5rem;
  font-weight: 600;
}

.no-users-content p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* Card View Styles */
.user-list-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.user-card {
  background: white;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
}

.user-card:hover {
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.05);
}

:deep(.user-card .el-card__body) {
  padding: 1.5rem;
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.user-name {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
  padding-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px;
  color: #5e87f5;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f5ff;
  color: #4c6ef5;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.info-icon {
  color: #5e87f5;
  font-size: 18px;
  flex-shrink: 0;
  width: 20px;
  display: flex;
  justify-content: center;
}

.info-text {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* Table View Styles */
.table-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

:deep(.custom-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.custom-table .el-table__header-wrapper) {
  background: #f8fafc;
}

:deep(.custom-table .el-table__header th) {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding: 16px 12px;
}

:deep(.custom-table .el-table__body td) {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

:deep(.custom-table .el-table__row:hover) {
  background: #f8faff;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.table-actions .el-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

/* Loading Styles */
:deep(.el-skeleton) {
  padding: 0;
}

:deep(.el-skeleton-item) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-view {
    padding: 1rem;
  }

  .user-view-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    padding: 1.25rem;
  }

  .user-view-header h1 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .user-header-actions {
    justify-content: center;
  }

  .user-list-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .user-card-header {
    flex-direction: row;
    align-items: stretch;
    gap: 1rem;
  }

  .user-name {
    padding-right: 0;
  }

  .user-actions {
    justify-content: center;
  }

  .table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  :deep(.custom-table) {
    min-width: 600px;
  }
}

@media (max-width: 480px) {
  .user-view {
    padding: 0.75rem;
  }

  .user-view-header {
    padding: 1rem;
  }

  .user-view-header h1 {
    font-size: 1.5rem;
  }

  :deep(.user-card .el-card__body) {
    padding: 1.25rem;
  }

  .table-actions {
    flex-direction: row;
    gap: 0.25rem;
  }

  .table-actions .el-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
