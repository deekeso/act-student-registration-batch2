<!-- UsersView.vue -->
<template>
  <div class="user-view">
    <div class="user-view-header">
      <h1>Users</h1>
      <SearchBar :users="userStore.users" @select="handleSelect" />
      <div class="user-header-actions">
        <el-button @click="addCardVisible = true">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button @click="selectedUser = null">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- VIEW OPTION -->
    <div>
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
    <div v-else-if="filteredUsers.length === 0" class="no-users">No users found.</div>

    <!-- CARD VIEW -->
    <div v-if="view === 'card' && !loading" class="user-list-card">
      <el-card
        v-for="user in filteredUsers"
        :key="user.id"
        class="user-card"
        @click="handleCardClick(user.id)"
      >
        <h3>
          {{ user.name }}
          <el-button link @click.stop="handleEditUser(user)">
            <el-icon color="#5e87f5"><EditPen /></el-icon>
          </el-button>
        </h3>
        <p>
          <el-icon color="#3d4b91"><Avatar /></el-icon> {{ user.username }}
        </p>
        <p>
          <el-icon color="#3d4b91"><Briefcase /></el-icon>{{ user.email }}
        </p>
        <p>
          <el-icon color="#3d4b91"><HomeFilled /></el-icon>
          {{ user.address.street }}, {{ user.address.city }}
        </p>
        <p v-if="user.createdAt!">
          <el-icon color="#3d4b91"><Checked /></el-icon> {{ user.createdAt }}
        </p>
      </el-card>
    </div>

    <!-- TABLE VIEW -->
    <div v-else-if="view === 'table' && filteredUsers.length !== 0">
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="username" label="Username" />
        <el-table-column label="Address">
          <template #default="{ row }"> {{ row.address.street }}, {{ row.address.city }} </template>
        </el-table-column>
        <el-table-column label="Actions" width="180">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEditUser(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(row.id)"
              >Delete</el-button
            >
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
import EditCard from '@/components/ui/card/EditCard.vue'
import AddCard from '@/components/ui/card/AddCard.vue'
import { ElMessage } from 'element-plus'
import {
  Avatar,
  Briefcase,
  Checked,
  EditPen,
  HomeFilled,
  Plus,
  Refresh,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'

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

function handleCardClick(id: number) {
  router.push(`/profile/${id}`)
}

function handleSelect(user: User) {
  // router.push(`/profile/${user.id}`)
  selectedUser.value = user
}
</script>

<style scoped>
.user-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-view-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-header-actions {
  display: flex;
  gap: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

.no-users {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

:deep(.el-tabs__item.is-active),
:deep(.el-tabs__item:hover) {
  color: #5e87f5;
}

:deep(.el-tabs__active-bar) {
  background-color: #5e87f5;
}

.user-list-card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid #e5e7eb;
}

.user-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.user-card h3 {
  margin-bottom: 1rem;
}

.user-card p {
  line-height: 1.5;
}

.user-card strong {
  color: #1f2937;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .user-view {
    padding: 1rem;
  }

  .user-list {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
