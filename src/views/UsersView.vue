<template>
  <div class="user-view">
    <h1>All Users</h1>
    <el-button @click="addCardVisible = true">Add</el-button>
    <div v-if="loading" class="loading">Loading users...</div>
    <div v-else-if="userStore.users.length === 0" class="no-users">No users found.</div>
    <div v-else class="user-list">
      <el-card v-for="user in userStore.users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
          <strong>Address:</strong>
          {{ user.address.street }}, {{ user.address.city }}
        </p>
        <p v-if="user.createdAt!"><strong>Created at:</strong> {{ user.createdAt }}</p>
        <div class="action-btn">
          <el-button size="small" type="primary" @click="handleEditUser(user)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDeleteUser(user.id!)"
            >Delete</el-button
          >
        </div>
      </el-card>
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
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import AddCard from '@/components/ui/AddCard.vue'
import type { NewUser } from '../types/user'
import EditCard from '@/components/ui/EditCard.vue'
import type { User } from '@/types/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const loading = ref(true)

onMounted(async () => {
  await userStore.fetchAllUsers()
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
</script>

<style scoped>
.user-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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

.user-list {
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

.action-btn {
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
