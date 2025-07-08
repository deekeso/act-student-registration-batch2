<template>
  <div class="table-container">
    <el-table :data="paginatedData">
      <!-- <el-table-column prop="id" label="id" /> -->
      <el-table-column align="center" prop="course" label="Course" />
      <el-table-column
        align="center"
        prop="lastName"
        label="Last Name"
        :formatter="(row: any) => (row.lastName ? row.lastName.toUpperCase() : '')"
        min-width="120"
      />
      <el-table-column
        align="center"
        prop="firstName"
        label="First Name"
        :formatter="(row: any) => (row.firstName ? row.firstName.toUpperCase() : '')"
        min-width="120"
      />
      <el-table-column
        align="center"
        prop="middleInitial"
        label="Middle Initial"
        :formatter="(row: any) => (row.middleInitial ? row.middleInitial.toUpperCase() + '.' : '')"
        width="100px"
      />
      <el-table-column align="center" type="date" prop="birthDate" label="Birth Date" width="120px">
        <template #default="scope">
          {{ formatDate(scope.row.birthDate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="age" label="Age" width="80px" />
      <el-table-column prop="address" label="Address" min-width="350px" align="center">
        <template #default="scope">
          <div style="text-align: center">
            {{ formatAddress(scope.row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="Actions"
        fixed="right"
        style="align-items: center"
        width="120px"
      >
        <template #default="scope">
          <el-button size="small" @click="$emit('edit', scope.row)" :suffix-icon="Edit"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
            :suffix-icon="Delete"
            >Delete</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <div style="text-align: center; color: #888; padding: 2rem">No data to display</div>
      </template>
    </el-table>
    <div class="pagination">
      <el-pagination
        :layout="paginationLayout"
        :total="data.length"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :pager-count="pagerCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <!-- <div class="pagination">
    <el-pagination
      :layout="paginationLayout"
      :total="data.length"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :pager-count="pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div> -->
</template>

<script lang="ts" setup>
import { defineEmits, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Student } from '@/types/Students'
import { formatDate } from '@/composables/birthday'
import { formatAddress } from '@/composables/formRules'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'

const props = defineProps<{ data: Student[] }>()

const currentPage = ref(1)
const pageSize = ref(10)
const screenWidth = ref(window.innerWidth)

// Responsive pagination configuration
const paginationLayout = computed(() => {
  if (screenWidth.value < 480) {
    // Mobile: Only show prev/next buttons and current page
    return 'prev, pager, next'
  } else if (screenWidth.value < 768) {
    // Tablet: Show total and navigation
    return 'total, prev, pager, next'
  } else {
    // Desktop: Show all elements
    return 'total, sizes, prev, pager, next, jumper'
  }
})

const pagerCount = computed(() => {
  if (screenWidth.value < 480) {
    // Mobile: Show minimal pages (< 1...6 >)
    return 3
  } else if (screenWidth.value < 768) {
    // Tablet: Show moderate pages
    return 5
  } else {
    // Desktop: Show full pages
    return 7
  }
})

// Handle window resize
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

function handleCurrentChange(page: number) {
  currentPage.value = page
}

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return props.data.slice(start, end)
})

watch(
  () => props.data.length,
  (newLength) => {
    if ((currentPage.value - 1) * pageSize.value >= newLength) {
      currentPage.value = 1
    }
  },
)

const emit = defineEmits<{
  (e: 'edit', student: Student): void
  (e: 'delete', student: Student): void
}>()

const handleDelete = async (student: Student) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this student? This action cannot be undone.',
      'Delete Confirmation',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        // type: 'error',
      },
    )
    ElMessage.success('Student deleted successfully!')
    emit('delete', student)
  } catch {
    // User cancelled, do nothing
  }
}
</script>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
}

.el-table {
  max-height: 800px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 3px solid rgb(38, 78, 198);
  height: 100vh;
  margin-top: 20px;
}

.pagination {
  margin: 40px;
  display: flex;
  justify-content: center;
}

.el-table__label {
  background-color: #2148c0;
  border-color: #2148c0;
  color: white;
}

.table-header {
  display: flex;
  margin-bottom: 1rem;
}

.filter-button {
  background-color: #2148c0;
  border-color: #2148c0;
  border-radius: 8px;
  font-weight: 500;
}

.filter-button:hover {
  background-color: #264eca;
  border-color: #264eca;
}

.el-button {
  width: 100%;
  border-radius: 8px;
}
.el-table .el-table__row .el-table__cell .el-button + .el-button {
  margin-top: 8px;
  margin-left: 0;
}

/* Responsive design */
@media (max-width: 1024px) {
  .table-container {
    width: 95vw !important;
    max-width: none !important;
    padding: 0 1rem;
  }

  .el-table {
    width: 95vw;
  }
}

@media (max-width: 768px) {
  .table-container {
    width: 95vw !important;
    max-width: none !important;
    padding: 0 1rem;
  }

  .el-table {
    width: 95vw;
  }

  .pagination {
    margin: 20px 10px;
  }
}

@media (max-width: 480px) {
  .table-container {
    width: 98vw !important;
    max-width: none !important;
  }

  .el-table {
    width: 98vw;
    height: 50vh;
  }

  .pagination {
    margin: 15px 5px;
  }

  /* Make pagination buttons smaller on mobile */
  .pagination :deep(.el-pagination .el-pager li) {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .pagination :deep(.el-pagination .btn-prev),
  .pagination :deep(.el-pagination .btn-next) {
    width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .pagination :deep(.el-pagination .el-pagination__total) {
    font-size: 12px;
  }
}

/* Tablet specific pagination styles */
@media (min-width: 481px) and (max-width: 768px) {
  .pagination :deep(.el-pagination .el-pager li) {
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
  }

  .pagination :deep(.el-pagination .btn-prev),
  .pagination :deep(.el-pagination .btn-next) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
  }

  .pagination :deep(.el-pagination .el-pagination__total) {
    font-size: 13px;
  }
}
</style>
