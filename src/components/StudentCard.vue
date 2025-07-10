<template>
  <el-card class="student-card" shadow="hover">

    <!-- Student name and course as header -->
    <template #header>
      <div class="card-header">
        <h3 class="card-title">{{ fullName }}</h3>
        <el-tag type="primary" effect="plain" size="small" class="course-badge">{{ student.course }}</el-tag>
      </div>
    </template>

    <!-- Student information -->
    <div class="student-info">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Age"> 
          {{ student.age }} years 
        </el-descriptions-item>

        <el-descriptions-item label="Birth Date">
          {{ formattedBirthDate }}
        </el-descriptions-item>

        <el-descriptions-item label="Address">
          {{ student.address }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- Card actions -->
    <template #footer>
    <div class="card-footer">
      <el-button type="primary" :icon="Edit" plain @click="$emit('edit', student.id)">
        Edit
      </el-button>
      <el-button type="danger" :icon="Delete" plain @click="$emit('delete', student.id)">
        Delete
      </el-button>
    </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

// Prop requiring student data
const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

// Emit events for edit and delete actions
const emit = defineEmits(['edit', 'delete'])

// Computed properties for student name and formatted birth date
const fullName = computed(() => {
  // Formats middle initial if available
  const middleInitial = props.student.middleInitial ? `${props.student.middleInitial}. ` : ''
  return `${props.student.firstName} ${middleInitial}${props.student.lastName}`
})

const formattedBirthDate = computed(() => {
  const date = new Date(props.student.birthDate)

  // Formats birth date to "Month Day, Year"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style scoped>
.student-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.student-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
}

.card-title {
  min-height: 44px;
  margin: 0;
  font-size: 1.1rem;
  color: black;
}

.course-badge {
  white-space: nowrap;
  overflow: hidden;
  width: auto;
}

:deep(.el-tag__content) {
  overflow: hidden;
  text-overflow: ellipsis;
}

.student-info {
  flex: 1;
}

:deep(.el-descriptions__label) {
  width: 100px;
  font-weight: bold;
}

:deep(.el-descriptions__content) {
  color: black;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: auto;
}

@media (max-width: 576px) {
  .card-header {
    flex-direction: column;
  }

  .card-title {
    min-height: auto;
  }

  .card-footer {
    flex-direction: column;
  }

  .course-badge {
  white-space: nowrap;
  overflow: hidden;
  max-width: 275px;
}

  :deep(.el-tag__content) {
  overflow: hidden;
  text-overflow: ellipsis;
}

  .card-footer .el-button {
    align-items: baseline;
    width: 100% !important;
    margin: 0 !important;
  }
}
</style>
