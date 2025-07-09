<template>
  <el-card shadow="hover">
    <div class="card-header">
      <div class="card-group">
        <el-icon><User /></el-icon>
        <h5 class="fullname">{{ fullname.length > 30 ?  `${fullname.slice(0, 30)}...` : fullname }}</h5>
      </div>
      <button color="#2148c0" @click="openDrawer">
        <el-icon color="white">
          <Edit />
        </el-icon>
      </button>
    </div>
    <div class="card-body" style="padding: 12px">
      <div class="icon">
        <el-icon><Calendar /></el-icon>
        <p>Age: <span>{{ props.age }}</span></p>
      </div>
      <div class="icon">
        <el-icon><IceTea /></el-icon>
        <p>Birthdate: <span>{{ props.birthdate }}</span></p>
      </div>
      <div class="icon">
        <el-icon><School /></el-icon>
        <p>Course: <span>{{ props.course }}</span></p>
      </div>
      <div class="icon">
        <el-icon><MapLocation /></el-icon>
        <p>Address: <span class="ellipsis">{{ address.length > 50 ? `${address.slice(0, 50)}...` :  address }}</span></p>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, computed, defineEmits } from 'vue'
import { ElCard } from 'element-plus'
import type { Users } from '@/types'
import { Edit, Calendar, School, MapLocation, User, IceTea } from '@element-plus/icons-vue'
import { capitalizeEachWord } from '@/utils/capitalize'

// toggle drawer
const emit = defineEmits(['open-drawer'])


// display the fullname
const fullname = computed(() => {
  if(props.middlename){
    return `${capitalizeEachWord(props.firstname ?? '')} ${props.middlename?.charAt(0).toUpperCase()}. ${capitalizeEachWord(props.lastname ?? '')} `
  } else {
    return `${capitalizeEachWord(props.firstname ?? '')} ${capitalizeEachWord(props.lastname ?? '')} `
  }
})

// display address 
const address = computed(() => `${capitalizeEachWord(props.address ?? '')}`)
// define props
const props = defineProps<Users>()


const openDrawer = () => {
  emit('open-drawer', props)
}
</script>

<style scoped>
.fullname {
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 12px;
}

p {
  font-size: small;
  font-weight: bold;
}

p span {
  font-weight: normal;
}


:deep(.el-card__body) {
  --el-card-padding: 12px;
}

.card-header {
  position: relative;
  padding: 8px;
}

.card-body,
.card-group {
  padding: 4px;
}

.card-header img {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  margin-right: 12px;
}

.card-group {
  display: flex;
  align-items: center;
}

.icon {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

button {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 4px;
  outline: none;
  background-color: var(--brand-blue);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
}
</style>