<script lang="ts" setup>
import { useRouter } from 'vue-router'

const props = defineProps<{ visible: boolean }>()
const emits = defineEmits(['update:visible'])
const router = useRouter()
</script>

<template>
  <el-drawer
    :model-value="props.visible"
    @update:modelValue="(val: boolean) => emits('update:visible', val)"
    direction="ltr"
    destroy-on-close
  >
    <el-container class="menu-container">
      <h1 class="menu-act" @click="router.push({ name: 'Home' })">HOME</h1>
    </el-container>
  </el-drawer>
</template>

<style scoped>
.menu-container {
  min-width: 100%;
}

.menu-act {
  position: relative;
  cursor: pointer;
  width: 100%;
  padding: 10px;
  transition: all 0.3s ease;
  z-index: 1;
  overflow: hidden;
}

.menu-act:hover {
  color: white;
  padding-left: 1rem;
}

.menu-act::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.menu-act:hover::after {
  transform: scaleX(1);
}
</style>
