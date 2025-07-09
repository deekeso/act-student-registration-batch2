<template>
  <div class="search-bar">
    <el-input
      v-model="nameFilterLocal"
      placeholder="Search by name"
      clearable
      :prefix-icon="Search"
      @input="updateNameFilter"
    />
    <el-select
      v-model="courseFilterLocal"
      placeholder="Filter by course"
      fit-input-width
      clearable
      @change="updateCourseFilter"
    >
      <el-option
        v-for="course in courses"
        :key="course"
        :label="course"
        :value="course"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { courses } from '@/constants'
import { Search } from '@element-plus/icons-vue'

const props = defineProps<{
  nameFilter: string
  courseFilter: string
}>()

const emits = defineEmits<{
  (e: 'update:nameFilter', value: string): void
  (e: 'update:courseFilter', value: string): void
}>()

const nameFilterLocal = ref(props.nameFilter)
const courseFilterLocal = ref(props.courseFilter)

watch(() => props.nameFilter, (val) => nameFilterLocal.value = val)
watch(() => props.courseFilter, (val) => courseFilterLocal.value = val)

function updateNameFilter(val: string) {
  emits('update:nameFilter', val.trim())
}

function updateCourseFilter(val: string) {
  emits('update:courseFilter', val)
}
</script>



<style scoped>

.search-bar {
  display: flex;
  gap: 16px;  
  margin-top: 10rem;
  margin-bottom: 16px;
}


@media (max-width: 560px) {
  .search-bar{
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }

  :deep(.el-input) {
    margin-bottom: 4px;
  }
}
</style>