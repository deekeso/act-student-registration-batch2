<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import UserCard from '@/components/UserCard.vue'
import TableUser from '@/components/TableUser.vue'
import AddUserDrawer from '@/components/AddUserDrawer.vue'
import { ElLoading, ElMessage } from 'element-plus'
import ActionCard from '@/components/ActionCard.vue'
import dayjs from 'dayjs'

const userStore = useUserStore()
const toggleList = ref('grid')
const showAddDrawer = ref(false)
const loading = ref(true)
const showActions = ref(false)

const handleRefresh = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Refreshing...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  await userStore.getUsers()

  loadingInstance.close()
  loading.value = false
  ElMessage.success('Refresh Successful!')
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
    <div class="actions">
      <el-button class="actions-btns" @click="handleRefresh"
        ><el-icon><RefreshRight /></el-icon
      ></el-button>
      <el-button class="actions-btns" @click="showActions = true"
        ><el-icon><Operation /></el-icon
      ></el-button>
      <el-button class="actions-btns" @click="toggleList = 'grid'"
        ><el-icon><Grid /></el-icon
      ></el-button>
      <el-button class="actions-btns" @click="toggleList = 'table'"
        ><el-icon><List /></el-icon
      ></el-button>
    </div>

    <div v-if="toggleList === 'grid'" class="grid-view">
      <UserCard v-if="!loading" />
    </div>
    <div v-if="toggleList === 'table'" class="table-view">
      <TableUser v-if="!loading" />
    </div>
  </section>

  <AddUserDrawer v-model:visible="showAddDrawer" />
  <ActionCard v-if="showActions" v-model:visible="showActions" />
</template>

<style scoped>
#list {
  min-height: 100%;
}

.grid-view {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 0 auto;
  width: 80%;
}

.table-view {
  display: flex;
  justify-content: center;
}

.actions {
  width: 80%;
  margin: 25px 0;
  text-align: right;
}

.actions-btns {
  font-size: 20px;
  height: 50px;
}
</style>
