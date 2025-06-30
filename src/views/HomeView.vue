<template>
  <div class="home-view">
    <el-row justify="center" class="hero-section">
      <el-col :span="24">
        <h1>Student Registration System</h1>
        <p class="lead">A modern platform for managing student registrations</p>
        <div class="action-buttons">
          <router-link to="/students">
            <el-button type="primary" size="large" :icon="Document">
              View Students
            </el-button>
          </router-link>
        </div>
      </el-col>
    </el-row>

    <el-divider/>

    <h1>Features</h1>

    <el-row :gutter="24" class="features-section">
      <el-col
        :xs="24"
        :sm="12"
        :md="6"
        v-for="(feature, index) in features"
        :key="index"
        class="feature-col"
      >
        <el-card class="feature-card" shadow="hover">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-divider/>

    <h1>Statistics</h1>

    <el-row :gutter="24" class="stats-section">
      <el-col :xs="24" :sm="12">
        <el-card class="stat-card" shadow="hover">
          <el-statistic :value="studentCount" title="Registered Students">
            <template #value>
              <div class="stat-number">{{ studentCount }}</div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="stat-card" shadow="hover">
          <el-statistic :value="availableCourses.length" title="Available Courses">
            <template #value>
              <div class="stat-number">{{ availableCourses.length }}</div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useStudentStore } from '@/stores/student'
import { computed } from 'vue'
import { Document, Edit, List } from '@element-plus/icons-vue'

const studentStore = useStudentStore()

const studentCount = computed(() => studentStore.studentCount)
const availableCourses = computed(() => studentStore.availableCourses)

const features = [
  {
    icon: '📝',
    title: 'Easy Registration',
    description: 'Register students quickly using the drawer form interface.' 
  },
  {
    icon: '📊',
    title: 'Student Management',
    description: 'View, edit, and delete student records in one place.',
  },
  {
    icon: '🔍',
    title: 'Course Selection',
    description: 'Choose from a variety of available courses (ex. BSCS, BSIT, etc.) for students.',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    description: 'Access the system on any device size with the responsive interface.',
  },
]
</script>

<style scoped>
/* .home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
} */

.home-view {
  text-align: center;
}

.hero-section {
  text-align: center;
  padding: 3rem 0;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: white;
}

.lead {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  color: #67B8F9;
}

.action-button {
  padding: 0 2rem;
}

.features-section {
  margin: 2rem 0;
}

.feature-col {
  margin-bottom: 1.5rem;
}

.feature-card {
  height: 100%;
  text-align: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  font-size: 1.25rem;
}

.feature-description {
  color: black;
  font-size: 0.9rem;
}

.stats-section {
  margin: 2rem 0 3rem;
}

.stat-card {
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  line-height: 1.2;
}

@media (max-width: 800px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .action-button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 0.5rem;
  }
}
</style>
