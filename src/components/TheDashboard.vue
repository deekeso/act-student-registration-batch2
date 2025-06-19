<template>
  <div class="programsList">
    <el-button @click="navigateTo('BSIT')"
      >Bachelor of Science in Information and Technology</el-button
    >
    <el-button>Bachelor in Computer Science</el-button>
    <el-button>Bachelor of Science in Tourism</el-button>
    <el-button>Bachelor of Science in Hotel and Restaurant Management</el-button>
    <el-button>Bachelor of Science in Nursing</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (program: string) => {
  if (program === 'BSIT') {
    router.push('/programs/BSIT')
  }
  // Add more programs here later, e.g.:
  // else if (program === 'BCS') {
  //   router.push('/programs/BCS');
  // }
}
</script>

<style scoped>
.el-button {
  display: flex;
  margin: 10px;
  width: 100%;
  height: 80px;
}
</style>
