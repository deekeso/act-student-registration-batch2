<template>
  <teleport to="#portal">
    <el-drawer
      class="drawer"
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      :title="title"
      direction="rtl"
      custom-class="drawer"
      :size="`${size}%`"
    >
      <slot></slot>
    </el-drawer>
  </teleport>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, defineEmits } from 'vue'

defineProps<{
  visible: boolean
  title: string
}>()

const size = ref<number>(30)

const emit = defineEmits(['update:visible'])


function resize() {
  if( window.innerWidth > 1280  &&  window.innerWidth < 1400){
    size.value = 30
  }
  else if (window.innerWidth >= 500  && window.innerWidth <= 1280) {
    size.value = 50
  } 
 
  else if (window.innerWidth < 500) {
    size.value = 100
  }
}


onMounted(() => {
  
  nextTick(() => {
    window.addEventListener('resize', resize)
  })
})


onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<style scoped></style>
