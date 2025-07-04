<!-- HomeView.vue -->
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useStudentStore } from '@/stores/StudentStore'
import BaseHeader from '@/components/BaseHeader.vue'
import StudentList from '@/components/StudentList.vue'
import RegisterDrawer from '@/components/RegisterDrawer.vue'
import EditDrawer from '@/components/EditDrawer.vue'
import type { Student } from '../interfaces/studentInterface'

const showStudentCard = ref(false)
const drawerRegister = ref(false)
const drawerEdit = ref(false)

const studentStore = useStudentStore()
const students = computed(() => studentStore.students)

const editStudentData = ref<Student | null>(null)
const editStudentIndex = ref(-1)

function handleEditStudent(student: Student, index: number) {
  editStudentData.value = student
  editStudentIndex.value = index
  drawerEdit.value = true
}

function handleDeleteStudent(student: Student, index: number) {
  studentStore.confirmDeleteStudent(student, index)
}

function handleStudentRegistered() {
  drawerRegister.value = false
}

function handleStudentUpdated() {
  drawerEdit.value = false
  editStudentIndex.value = -1
  editStudentData.value = null
}

onMounted(() => {
  studentStore.loadStudents()
})
</script>

<template>
  <BaseHeader />
  <div class="page-body">
    <div v-if="!showStudentCard" class="dashboard-cards">
      <el-card class="action-card" shadow="hover">
        <div class="card-header">
          <span class="card-title">
            <el-icon><UserFilled /></el-icon>
            Register a Student
          </span>
        </div>
        <div class="card-body">
          <p class="card-description">
            Add new students to the system with their personal information and course selections.
          </p>
          <el-button type="primary" class="action-btn" @click="drawerRegister = true">
            <el-icon><Plus /></el-icon>
            Open Registration
          </el-button>
        </div>
      </el-card>

      <el-card class="action-card" shadow="hover">
        <div class="card-header">
          <span class="card-title">
            <el-icon><Grid /></el-icon>
            Display Students
          </span>
        </div>
        <div class="card-body">
          <p class="card-description">
            View all registered students in an organized card layout with their details.
          </p>
          <el-button type="success" class="action-btn" @click="showStudentCard = true">
            <el-icon><View /></el-icon>
            Show Students
          </el-button>
        </div>
      </el-card>
    </div>

    <StudentList
      v-if="showStudentCard"
      :students="students"
      @edit-student="handleEditStudent"
      @delete-student="handleDeleteStudent"
      @hide-students="showStudentCard = false"
    />
  </div>
  <RegisterDrawer v-model="drawerRegister" @student-registered="handleStudentRegistered" />

  <EditDrawer
    v-model="drawerEdit"
    :student="editStudentData"
    :student-index="editStudentIndex"
    @student-updated="handleStudentUpdated"
  />
</template>

<style lang="css" scoped>
.page-body {
  min-height: 100vh;
  background: #020024;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 15%,
    rgba(9, 9, 121, 1) 66%,
    rgba(0, 212, 255, 1) 100%
  );
  padding: 1rem;
}

.dashboard-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  justify-content: center;
  margin: 100px auto;
  padding: 1rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  margin-top: 20px;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: none;
}

.action-card:hover {
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.action-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b5b95);
}

@media (max-width: 768px) {
  .page-body {
    padding: 0.5rem;
  }

  .dashboard-cards {
    gap: 1rem;
    padding: 0.5rem;
  }

  .action-card {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .dashboard-cards {
    padding: 0.25rem;
  }

  .action-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.875rem;
  }

  .action-btn {
    height: 44px;
    font-size: 0.875rem;
  }
}
</style>
