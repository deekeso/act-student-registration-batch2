<template>
  <div class="table-container">
    <el-table :data="data">
      <!-- <el-table-column prop="id" label="id" /> -->
      <el-table-column align="center" prop="course" label="Course" />
      <el-table-column
        align="center"
        prop="lastName"
        label="Last Name"
        :formatter="(row: any) => (row.lastName ? row.lastName.toUpperCase() : '')"
      />
      <el-table-column
        align="center"
        prop="firstName"
        label="First Name"
        :formatter="(row: any) => (row.firstName ? row.firstName.toUpperCase() : '')"
      />
      <el-table-column
        align="center"
        prop="middleInitial"
        label="Middle Initial"
        :formatter="(row: any) => (row.middleInitial ? row.middleInitial.toUpperCase() : '')"
      />
      <el-table-column align="center" type="date" prop="birthDate" label="Birth Date">
        <template #default="scope">
          {{ formatDate(scope.row.birthDate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="age" label="Age" />
      <el-table-column prop="address" label="Address" />
      <el-table-column align="center" label="Actions">
        <template #default="scope">
          <el-button size="small" @click="$emit('edit', scope.row)">Edit</el-button>
          <el-button size="small" type="danger" @click="$emit('delete', scope.row)"
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
import { formatDate } from '@/composables/birthday'

defineProps<{
  data: Student[]
}>()

defineEmits<{
  (e: 'edit', student: Student): void
  (e: 'delete', student: Student): void
}>()
</script>

<style scoped>
.table-container {
  margin: 2rem 0 0 0;
  display: flex;
  justify-content: center;
  height: 800px;
}
.el-table {
  width: 80%;
  height: 800px;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 5px solid #e0e0e0;
}
</style>
