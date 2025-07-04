<template>
  <div class="container">
    <div class="search-bar">
      <el-input v-model="nameFilter" placeholder="Search by name" clearable  :prefix-icon="Search"  />

      <el-select v-model="courseFilter" placeholder="Filter by course" fit-input-width  clearable>
        <el-option v-for="course in courses" :key="course" :label="course" :value="course" />
      </el-select>
    </div>
    <the-header></the-header>
    <ul v-if="filteredStudents" class="card-list">
      <the-card
        v-for="student in filteredStudents"
        :key="student.id"
        :id="student.id"
        :firstname="student.firstname"
        :middlename="student.middlename"
        :lastname="student.lastname"
        :age="Number(student.age)"
        :birthdate="student.birthdate"
        :course="student.course"
        :address="student.address"
      />
      
    </ul>

    <el-empty v-if="!filteredStudents.length" description="No Students Found" />
  </div>
</template>

<script lang="ts" setup>
import { TheCard, TheHeader } from '@/components/ui'
import { useAuth } from '@/composables/useAuth'
import { onMounted, watch, ref, computed } from 'vue'
import { useStudents } from '@/stores/students'
import { courses } from '@/constants'
import { Search } from '@element-plus/icons-vue'

const studentsStore = useStudents()

// holds the value of name filter
const nameFilter = ref('')

// holds the value of course filter
const courseFilter = ref('')

// Update store filters
watch(nameFilter, (val) => {
  val = val.trim();
  studentsStore.setFilterName(val)
})
watch(courseFilter, (val) => {
  studentsStore.setFilterCourse(val)
})

const filteredStudents = computed(() => studentsStore.allStudents)

const { checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}




:deep(.el-input) {
  width: 300px;
  margin-bottom: 10px;
}

:deep(.el-select) {
  margin-left: 10px;
  text-overflow: ellipsis;
}


.search-bar {
  width:  700px;
  margin-top: 10rem;
  display: flex;
  gap: 4px;
  justify-content: center;
}

.card-list {
  --grid-cols: 4;
  max-width: 1440px;
  display: grid;
  grid-template-columns: repeat(var(--grid-cols), 1fr);
  gap: 12px;
  background-color: #fff;
  padding: 4px;
  border-radius: 4px;
  margin-bottom: 32px;
}

/* search-bar */
@media (max-width: 560px) {
  .search-bar {
    flex-direction: column;
  }

  .search-bar input {
    width: 100%;
  }
}

/* for grid column */
@media (max-width: 1460px) {
  .container {
    padding: 20px;
  }

  .card-list {
    --grid-cols: 4;
  }
}

@media (max-width: 1255px) {
  .card-list {
    --grid-cols: 3;
  }
}

@media (max-width: 900px) {
  .card-list {
    --grid-cols: 2;
  }
}

@media (max-width: 700px) {
  .card-list {
    --grid-cols: 1;
    width: 100%;
  }
}



/* search-bar */
@media (max-width: 560px) {
  .search-bar {
    flex-direction: column;
    width: 100%;
  }

  :deep(.el-input) {
    width: 100%;
  }

  :deep(.el-select) {
    width: 100%;
    margin: 0px;
  }
}
</style>
