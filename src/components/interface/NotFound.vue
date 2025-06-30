<template>
  <div class="not-found">
    <div class="not-found-2">
      <el-card class="not-found-card">
        <template #header>
          <div class="return-link">
            <el-icon size="25px" @click="goBack"><Back /></el-icon>
            <!-- <a style="padding-left: 10px; font-size: 18px">Return</a> -->
          </div>
        </template>
        <div class="not-found-content">
          <p class="not-found-header">404</p>
          <p class="not-found-subheader">Page Not Found</p>
          <p class="not-found-desc">
            The page you requested could not be found. Please check the URL or return to the
            previous page.
          </p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function goBack() {
  router.back()
}
</script>

<style scoped>
.not-found {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
}

.not-found-2 {
  grid-column: span 3 / span 3;
  grid-row: span 2 / span 2;
  grid-column-start: 2;
  grid-row-start: 1;
}

.not-found-content {
  margin-bottom: 0px;
}

.not-found-card {
  background-color: transparent;
  color: white;
  border-radius: 10px;
  margin-top: 80px;
}

.not-found-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 70px;
}

.not-found-subheader {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.not-found-desc {
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  font-size: 15px;
  padding: 20px;
  text-align: center;
  width: 100%;
}

:deep(.el-card__header) {
  border-bottom: 0 !important;
}
.return-link {
  color: white;
  display: flex;
  align-items: start;
  justify-content: start;
  cursor: pointer;
}

.return-link:hover {
  color: #409eff;
}
</style>
