<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import EditUserDrawer from './EditUserDrawer.vue'

const userStore = useUserStore()
const selectedUserId = ref<number | null | undefined>(null)

const showEditDrawer = ref(false)
</script>

<template>
  <el-card class="user-card" v-for="(user, index) in userStore.user" :key="index" shadow="hover">
    <div class="user-content">
      <!--DROPDOWN-->
      <div class="dropdown-wrapper">
        <el-dropdown>
          <el-button class="dropdown-icon"
            ><el-icon><MoreFilled /></el-icon
          ></el-button>

          <template #dropdown>
            <el-dropdown-menu class="dropdown-menu">
              <el-dropdown-item
                class="dropdown-item"
                @click="
                  () => {
                    showEditDrawer = true
                    selectedUserId = user.id
                  }
                "
              >
                <el-icon><EditPen /></el-icon>Edit</el-dropdown-item
              >
              <el-dropdown-item
                class="dropdown-item"
                @click="userStore.deleteUser(user.id as number)"
              >
                <el-icon><DeleteFilled /></el-icon>Delete</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!--USER INFO-->

      <router-link class="router-link-style" :to="`/user/${user.id}`">
        <div class="header">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-name">{{ `@${user.username}` }}</p>
        </div>
      </router-link>
    </div>
  </el-card>

  <EditUserDrawer v-model:visible="showEditDrawer" :user-id="selectedUserId" />
</template>

<style scoped>
:deep(.el-button) {
  margin-left: 0 !important;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.user-card {
  width: 450px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  height: 200px;
  justify-content: space-between;
  overflow-y: auto;
}

.user-content {
  padding: 10px 20px;
  flex: 1;
}

.dropdown-menu {
  width: 120px;
}
.dropdown-icon {
  font-size: 16px;
  border: none;
  padding: 5px;
}

:deep(.dropdown-item) {
  font-size: 15px;
}

.router-link-style {
  text-decoration: none;
  color: inherit;
}

.dropdown-wrapper {
  text-align: right;
}
</style>
