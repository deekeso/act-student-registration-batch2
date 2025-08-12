<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import EditUserDrawer from './EditUserDrawer.vue'

const userStore = useUserStore()
const selectedUserId = ref<number | null | undefined>(null)
const showEditDrawer = ref(false)
</script>

<template>
  <el-table :data="userStore.user" style="width: 85%; border: 1px black solid">
    <el-table-column prop="name" label="Name" show-overflow-tooltip />
    <el-table-column prop="username" label="Username" show-overflow-tooltip />
    <el-table-column label="Actions">
      <template #default="{ row }">
        <el-button
          @click="
            () => {
              showEditDrawer = true
              selectedUserId = row.id
            }
          "
          >Edit</el-button
        >

        <el-button @click="userStore.deleteUser(row.id)">Delete</el-button>
      </template>
    </el-table-column>
    <el-table-column label="View">
      <template #default="{ row }">
        <router-link class="link-style" :to="`/user/${row.id}`">Details</router-link>
      </template>
    </el-table-column>
  </el-table>

  <EditUserDrawer v-model:visible="showEditDrawer" :user-id="selectedUserId" />
</template>

<style scoped>
:deep(.el-button) {
  margin-left: 0px !important;
  margin-right: 10px;
}

.link-style {
  color: inherit;
}
</style>
