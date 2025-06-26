<template>
  <div class="table-container">
    <el-table :data="data">
      <!-- <el-table-column prop="id" label="id" /> -->
      <el-table-column align="center" prop="course" label="Course" width="80px" />
      <el-table-column
        align="center"
        prop="lastName"
        label="Last Name"
        :formatter="(row: any) => (row.lastName ? row.lastName.toUpperCase() : '')"
        width="120px"
      />
      <el-table-column
        align="center"
        prop="firstName"
        label="First Name"
        :formatter="(row: any) => (row.firstName ? row.firstName.toUpperCase() : '')"
        width="100px"
      />
      <el-table-column
        align="center"
        prop="middleInitial"
        label="Middle Initial"
        :formatter="(row: any) => (row.middleInitial ? row.middleInitial.toUpperCase() : '')"
        width="100px"
      />
      <el-table-column align="center" type="date" prop="birthDate" label="Birth Date" width="120px">
        <template #default="scope">
          {{ formatDate(scope.row.birthDate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="age" label="Age" width="80px" />
      <el-table-column prop="address" label="Address" min-width="400px" align="center">
        <template #default="scope">
          <div style="text-align: left">
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
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import type { Student } from '@/types/Students'
import { formatDate, formatAddress } from '@/composables/birthday'
import { ElMessageBox } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'

defineProps<{ data: Student[] }>()

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
    emit('delete', student)
  } catch {
    // User cancelled, do nothing
  }
}
</script>

<style scoped>
.table-container {
  /*  margin: 2rem 0 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85vh; */

  display: flex;
  justify-content: center;
  align-items: center;
  width: 80vw auto;
  height: 85vh;
}
.el-table {
  width: 80vw;
  height: 70vh;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 5px solid #e0e0e0;
}
.el-table .el-button {
  width: 100%;
  margin: 4px 0;
  border-radius: 8px;
}
.el-table .el-table__row .el-table__cell .el-button + .el-button {
  margin-top: 8px;
  margin-left: 0;
}
.el-table .el-table__cell .el-button {
  display: block;
}
.el-table .el-table__cell {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 30px;
}
</style>
