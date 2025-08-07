<template>
  <div class="search-bar">
    <el-autocomplete
      v-model="searchQuery"
      :fetch-suggestions="querySearch"
      placeholder="Search by name, username, or email"
      class="search-input"
      clearable
      @select="handleSelect"
    >
      <template #prefix>
        <el-icon class="search-icon">
          <Search />
        </el-icon>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
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

<style scoped>
.search-bar {
  flex: 1;
  max-width: 400px;
  min-width: 280px;
}

.search-input {
  width: 100%;
}

:deep(.search-input .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 0 16px;
  height: 44px;
}

:deep(.search-input .el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

:deep(.search-input .el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

:deep(.search-input .el-input__inner) {
  color: white;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  height: 100%;
}

:deep(.search-input .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

:deep(.search-input .el-input__prefix) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.search-input .el-input__suffix) {
  color: rgba(255, 255, 255, 0.8);
}

.search-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

:deep(.search-input .el-input__clear) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

:deep(.search-input .el-input__clear:hover) {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

/* Autocomplete dropdown styling */
:deep(.el-autocomplete-suggestion) {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .search-bar {
    width: 100%;
    max-width: none;
    min-width: 0;
    margin: 0;
  }

  :deep(.search-input .el-input__inner::placeholder) {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  :deep(.search-input .el-input__wrapper) {
    height: 40px;
    padding: 0 12px;
  }

  :deep(.search-input .el-input__inner) {
    font-size: 13px;
  }

  :deep(.search-input .el-input__inner::placeholder) {
    content: 'Search users...';
  }
}
</style>
