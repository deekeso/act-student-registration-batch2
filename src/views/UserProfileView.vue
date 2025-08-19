<script lang="ts" setup>
import type { User } from '@/types/User'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import dayjs from 'dayjs'
import CommentComp from '@/components/CommentComp.vue'

const route = useRoute()
const router = useRouter()
const user = ref<User | null>(null)
const loading = ref(false)
const userStore = useUserStore()

const fetchUser = async () => {
  try {
    loading.value = true
    const id = Number(route.params.id)
    await userStore.getUsers()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    loading.value = false
    user.value = userStore.user.find((u) => u.id === id) || null
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  console.log('Profile page mounted')
  await fetchUser()
  if (user.value && !user.value.createdAt) {
    user.value.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
})
</script>

<template>
  <section id="profile">
    <el-card v-loading="loading" class="profile-card">
      <div class="user-container">
        <div v-if="loading" class="loading-state">
          <h1>LOADING...</h1>
        </div>
        <div v-if="!loading && user" class="user-content">
          <div class="header">
            <h2 class="user-name">{{ user?.name }}</h2>
            <p class="username">{{ `@${user?.username}` }}</p>
          </div>

          <div class="divider"></div>

          <div class="details-section">
            <div class="detail-item">
              <span class="detail-label"
                ><el-icon><Message /></el-icon> Email</span
              >
              <span class="detail-value">{{ user?.email }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">
                <el-icon><Location /></el-icon> Street</span
              >
              <span class="detail-value">{{ user?.address?.street }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"
                ><el-icon><OfficeBuilding /></el-icon> City</span
              >
              <span class="detail-value">{{ user?.address?.city }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"
                ><el-icon><Timer /></el-icon> Created At</span
              >
              <span class="detail-value">{{ user?.createdAt }}</span>
            </div>
          </div>
        </div>

        <div v-if="!user && !loading" class="user-not-found">
          <h2>USER NOT FOUND</h2>
          <p>GO BACK TO MENU</p>
          <el-button class="user-not-found-btn" @click="router.push('/')"> Go back</el-button>
        </div>
      </div>
    </el-card>

    <CommentComp v-if="user" />
  </section>
</template>

<style scoped>
#profile {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.profile-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750px;
  min-height: 600px;
  padding: 40px 30px;
  box-sizing: border-box;
  background-color: white;
}

.user-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  gap: 10px;
}

.user-not-found-btn {
  padding: 20px;
}

.user-not-found h2 {
  letter-spacing: 5px;
  font-size: 2rem;
}

.user-not-found p {
  letter-spacing: 3px;
  font-size: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.user-name {
  font-size: 32px;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.username {
  font-size: 18px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #e8e8e8;
  margin: 20px 0 30px 0;
}

.details-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  flex-wrap: wrap;
}

.detail-label {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.detail-value {
  font-size: 20px;
  color: #666;
  text-align: right;
  flex: 1;
  margin-left: 20px;
}

.loading-state {
  align-items: center;
  margin: auto;
}
.loading-state h1 {
  font-weight: bold;
  letter-spacing: 5px;
}

/* 📱 Mobile Responsive Styling */
@media (max-width: 768px) {
  .user-container {
    width: 100%;
    padding: 20px;
    min-height: auto;
  }

  .user-name {
    font-size: 26px;
  }

  .username {
    font-size: 16px;
  }

  .detail-label {
    font-size: 18px;
  }

  .detail-value {
    font-size: 16px;
    margin-left: 10px;
    text-align: left;
  }

  .details-section {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .user-container {
    padding: 15px;
  }

  .user-name {
    font-size: 22px;
  }

  .username {
    font-size: 14px;
  }

  .detail-label {
    font-size: 16px;
  }

  .detail-value {
    font-size: 14px;
  }

  .loading-text {
    font-size: 18px;
  }
}
</style>
