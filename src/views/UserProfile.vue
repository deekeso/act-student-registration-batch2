<template>
  <div class="profile-view">
    <!-- Loading State -->
    <div v-if="isLoading" class="profile-loading">
      <el-skeleton animated>
        <template #template>
          <div class="profile-skeleton">
            <!-- Header skeleton -->
            <div class="skeleton-header">
              <el-skeleton-item variant="circle" style="width: 120px; height: 120px" />
              <div class="skeleton-info">
                <el-skeleton-item variant="h1" style="width: 200px; height: 32px" />
                <el-skeleton-item
                  variant="text"
                  style="width: 150px; height: 20px; margin-top: 8px"
                />
              </div>
            </div>
            <!-- Content skeleton -->
            <div class="skeleton-content">
              <el-skeleton-item variant="rect" style="height: 200px; border-radius: 16px" />
              <el-skeleton-item
                variant="rect"
                style="height: 150px; border-radius: 16px; margin-top: 1.5rem"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- Profile Content -->
    <div v-else-if="userStore.selectedUser" class="profile-content">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <el-icon size="64" color="white">
            <Avatar />
          </el-icon>
        </div>
        <div class="profile-title">
          <h1>
            {{ userStore.selectedUser.name }}
          </h1>
          <p class="profile-subtitle">
            User Profile
            <span v-if="userStore.selectedUser.createdAt!"
              >| Created at: {{ userStore.selectedUser.createdAt }}</span
            >
          </p>
        </div>
        <div class="profile-actions">
          <el-button type="primary" @click="$router.go(-1)" title="Go back">
            <el-icon><ArrowLeft /></el-icon>
            Back
          </el-button>
        </div>
      </div>

      <!-- Profile Information Cards -->
      <div class="profile-cards">
        <!-- Contact Information -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon" color="#5e87f5">
                <Message />
              </el-icon>
              <span class="card-title">Contact Information</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <el-icon class="info-icon">
                  <Message />
                </el-icon>
                Email
              </div>
              <div class="info-value">{{ userStore.selectedUser.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">
                <el-icon class="info-icon">
                  <Avatar />
                </el-icon>
                Username
              </div>
              <div class="info-value">{{ userStore.selectedUser.username }}</div>
            </div>
          </div>
        </el-card>

        <!-- Address Information -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon" color="#5e87f5">
                <Location />
              </el-icon>
              <span class="card-title">Address Information</span>
            </div>
          </template>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">
                <el-icon class="info-icon">
                  <Location />
                </el-icon>
                Address
              </div>
              <div class="info-value">
                {{ userStore.selectedUser.address.street }},
                {{ userStore.selectedUser.address.city }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Error/No User State -->
    <div v-else class="no-user">
      <div class="no-user-content">
        <el-icon size="64" color="#cbd5e1">
          <UserFilled />
        </el-icon>
        <h3>User not found</h3>
        <p>The requested user could not be found</p>
        <el-button type="primary" @click="$router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          Back to Users
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Avatar, ArrowLeft, Message, Location, UserFilled } from '@element-plus/icons-vue'
import type { User } from '@/types/user'

const userStore = useUserStore()
const route = useRoute()
const isLoading = ref(true)
const userDeleted = ref(false)
const selectedUser = ref<User | null>(null)

onBeforeMount(() => {
  console.log('onBeforeMount: Preparing to mount ProfileView.vue')
  // Reset selectedUser to ensure clean state before fetching
  userStore.selectedUser = null
  selectedUser.value = null
})

onMounted(async () => {
  console.log('onMounted: Mounting ProfileView.vue for user ID:', route.params.id)
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    try {
      await userStore.fetchUserById(id)
      await new Promise((resolve) => setTimeout(resolve, 600))
    } catch (error) {
      console.error('onMoundted: Failed to fetch user:', error)
    } finally {
      console.log('onMounted: Setting isLoading to false')
      isLoading.value = false
    }
  } else {
    console.log('onMounted: Skipping fetch due to invalid ID')
  }
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount: Unmounting ProfileView.vue, cleaning up user state')

  // Clean up store state to prevent stale data
  userStore.selectedUser = null
})

// Watch for changes in selectedUser to handle deletion
watch(
  () => userStore.selectedUser,
  (newUser, oldUser) => {
    if (oldUser && !newUser && !isLoading.value) {
      userDeleted.value = true
    }
  },
)
</script>

<style scoped>
.profile-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* Loading Styles */
.profile-loading {
  padding: 2rem;
}

.profile-skeleton {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton-info {
  flex: 1;
}

.skeleton-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* Profile Content */
.profile-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  color: white;
}

.profile-avatar {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.profile-title {
  flex: 1;
  min-width: 0;
}

.profile-title h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-subtitle {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.profile-actions {
  flex-shrink: 0;
}

.profile-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.profile-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Profile Cards */
.profile-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.info-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

:deep(.info-card .el-card__header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
}

:deep(.info-card .el-card__body) {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-icon {
  font-size: 20px;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-icon {
  font-size: 16px;
  color: #5e87f5;
}

.info-value {
  font-size: 1rem;
  color: #334155;
  font-weight: 500;
  padding-left: 1.5rem;
  word-break: break-all;
}

.website-link {
  color: #5e87f5;
  text-decoration: none;
  transition: color 0.2s ease;
}

.website-link:hover {
  color: #4c6ef5;
  text-decoration: underline;
}

/* No User State */
.no-user {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.no-user-content {
  text-align: center;
  padding: 3rem;
}

.no-user-content h3 {
  margin: 1.5rem 0 0.5rem;
  color: #374151;
  font-size: 1.5rem;
  font-weight: 600;
}

.no-user-content p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0 0 2rem;
}

.no-user-content .el-button {
  border-radius: 12px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-view {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .profile-title h1 {
    font-size: 1.5rem;
    white-space: normal;
  }

  .profile-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .skeleton-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .skeleton-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .profile-view {
    padding: 0.75rem;
  }

  .profile-header {
    padding: 1.25rem;
  }

  .profile-title h1 {
    font-size: 1.25rem;
  }

  :deep(.info-card .el-card__header) {
    padding: 1rem 1.25rem;
  }

  :deep(.info-card .el-card__body) {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .info-value {
    font-size: 0.9rem;
  }
}
</style>
