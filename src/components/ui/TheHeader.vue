<template>
  <div class="header">
    <div class="header-content">
      <h1>Student Registration System</h1>
      <el-button text @click="handleLogout" size="small" :prefix-icon="Right"> Logout </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { Right } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.clearCredentials()
  ElMessage.success('Logged out successfully')
  router.push('/')
}
</script>

<style scoped>
.header {
  background: linear-gradient(
    90deg,
    rgba(33, 72, 192, 1) 16%,
    rgba(33, 72, 192, 1) 36%,
    rgba(105, 144, 255, 1) 53%,
    rgba(68, 95, 186, 1) 79%,
    rgba(46, 65, 145, 1) 100%,
    rgba(255, 255, 255, 1) 100%,
    rgba(230, 237, 250, 1) 100%
  );
  color: #2148c0;
  padding: 16px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 400;
  color: #fff;
}

:deep(.el-button) {
  color: #2148c0;
  border-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-button > span) {
  font-weight: 600;
  color: #fff;
  transition: color 0.3s ease;
  font-size: 14px;
}

:deep(.el-button:hover > span) {
  color: #2148c0;
}
</style>
