<template>
  <el-table :data="data" border style="width: 100%">
    <el-table-column prop="firstName" label="First Name" />
    <el-table-column prop="middleInitial" label="Middle Initial" />
    <el-table-column prop="lastName" label="Last Name" />
    <el-table-column prop="birthDate" label="Birth Date" />
    <el-table-column prop="age" label="Age" />
    <el-table-column prop="address" label="Address" />
    <el-table-column prop="course" label="Course" />
    <el-table-column label="Actions">
      <template #default="scope">
        <el-button size="small" @click="$emit('edit', scope.row)">Edit</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import type { Student } from '@/types/Students'

const { data } = defineProps<{
  data: Student[]
}>()

defineEmits<{
  (e: 'edit', student: Student): void
  (e: 'delete', student: Student): void
}>()
</script>
