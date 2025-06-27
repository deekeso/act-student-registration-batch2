<template>
  <div class="course-search-bar">
    <el-select
      :model-value="props.modelValue"
      @update:model-value="(val: string) => emit('update:modelValue', val)"
      placeholder="Search by course"
      clearable
      filterable
      style="width: 100%"
    >
      <el-option
        v-for="course in courses"
        :key="course.value"
        :value="course.value"
        :label="course.label"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { courses } from '@/constants/index'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
.course-search-bar {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  margin: 0;
}

.course-search-bar :deep(.el-select) {
  width: 100%;
}

.course-search-bar :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 40px;
}

.course-search-bar :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.course-search-bar :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(26, 58, 154, 0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .course-search-bar {
    width: 90vw;
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .course-search-bar {
    width: 95vw;
  }
}
</style>
