<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import type { User } from '@/types/User'
import { useRouter } from 'vue-router'

const userStore = useUserStore()

const searchText = ref('')
const router = useRouter()

const querySearchAsync = (
  queryString: string,
  callback: (results: { value: string; label: string; user: User }[]) => void,
) => {
  const query = queryString.toLowerCase().trim()

  if (!queryString.trim()) {
    callback([])
    return
  }

  const results = userStore.user
    .filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      )
    })
    .map((user) => ({
      value: user.name ?? '',
      label: `${user.name} (${user.email})`,
      user,
    }))

  callback(results)
}

const handleSelect = (selected: { value: string; user: User }) => {
  //guard
  if (selected.user.id !== undefined) {
    router.push(`/user/${encodeURIComponent(selected.user.id)}`)
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="logo"> <span></span> PROFILE FINDER </router-link>

      <div class="search-wrapper">
        <el-autocomplete
          v-model="searchText"
          prefix-icon="search"
          class="search-bar"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          clearable
          placeholder="Search a user"
          @select="handleSelect"
        >
          <template #default="{ item }">
            <div v-if="item && item.user">
              <strong>{{ item.user.name }}</strong> <br />
              <small>{{ item.user.username }}</small> <br />
              <small>{{ item.user.email }}</small>
            </div>
            <div v-else>No matching users</div>
          </template>
        </el-autocomplete>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 70%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #1f2937;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo:hover {
  color: #374151;
}

.search-wrapper {
  flex: 1;
  max-width: 350px;
  min-width: 250px;
}

.search-bar {
  width: 100%;
}
</style>
