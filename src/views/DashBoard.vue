<template>
  <Header />
  <main class="container">
     <student-search
      v-model:nameFilter="nameFilter"
      v-model:courseFilter="courseFilter"
    />
    <ul v-if="filteredStudents.length" class="card-list">
      <student-card
        v-for="student in filteredStudents.slice(0, showMore)"
        :key="student.id"
        :id="student.id"
        :firstname="student.firstname"
        :middlename="student.middlename"
        :lastname="student.lastname"
        :age="Number(student.age)"
        :birthdate="student.birthdate"
        :course="student.course"
        :address="student.address"
        @open-drawer="openDrawerApp"
      />
    </ul>
    <student-drawer v-model:visible="isDrawerVisible" :title="`Edit Student Information`">
      <student-form :student="selectStudent" @on-drawer-close="closeDrawerApp"/> 
    </student-drawer>
    <div class="center">
       <el-empty v-if="!filteredStudents.length" description="No Students Found" />
      <el-button v-if="!nameFilter && !courseFilter && filteredStudents.length > showMore" color="#2148c0" @click="showMore += 4">Show More</el-button>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { TheCard as StudentCard, TheHeader as Header, TheDrawer as StudentDrawer, TheSearchBar as StudentSearch } from '@/components/ui'
import { StudentForm } from '@/components'
// import { useAuth } from '@/composables/useAuth'
import {  watch, ref, computed } from 'vue'
import { useStudents } from '@/stores/students'
import type { Users } from "@/types"


const showMore = ref<number>(12)

const isDrawerVisible = ref(false);
const selectStudent = ref<Users>({})

function openDrawerApp(student: Users){
    isDrawerVisible.value = true
    selectStudent.value = { ...student };
    console.log(selectStudent.value)
}

function closeDrawerApp(){
  isDrawerVisible.value = false
  selectStudent.value = {}
}

// students store
const studentsStore = useStudents()

const nameFilter = ref('')
const courseFilter = ref('')

watch(nameFilter, (val) => studentsStore.setFilterName(val))
watch(courseFilter, (val) => studentsStore.setFilterCourse(val))

const filteredStudents = computed(() => studentsStore.allStudents)

</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  box-sizing: border-box;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}


.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 32px;
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
  .container {
    padding: 20px;
  }
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


</style>
