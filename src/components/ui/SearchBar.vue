<template>
  <div class="search-bar">
    <el-autocomplete
      v-model="searchQuery"
      :fetch-suggestions="querySearch"
      placeholder="Search by name, username, or email"
      style="width: 860px"
      clearable
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'update:filteredUsers', users: User[]): void
  (e: 'select', user: User): void
}>()

const searchQuery = ref('')

// Search function for autocomplete suggestions
const querySearch = (query: string, cb: (arg: { value: string }[]) => void) => {
  const results = query
    ? props.users
        .filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()),
        )
        .map((user): User & { value: string } => ({
          value: user.name,
          ...user,
        }))
    : props.users.map((user) => ({
        value: user.name,
        ...user,
      }))
  cb(results)
}

// Watch search query and emit filtered users
watch(
  searchQuery,
  (newQuery) => {
    const filtered = newQuery
      ? props.users.filter(
          (user) =>
            user.name.toLowerCase().includes(newQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(newQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(newQuery.toLowerCase()),
        )
      : props.users
    emit('update:filteredUsers', filtered)
  },
  { immediate: true },
)

const handleSelect = (item: User) => {
  emit('select', item)
}
</script>

<style scoped></style>
