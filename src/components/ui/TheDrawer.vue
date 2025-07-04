<template>
  <teleport to="#portal">
    <el-drawer
      class="drawer"
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      title="Student Information"
      direction="rtl"
      custom-class="drawer"
      :size="`${size}%`"
    >
      <slot></slot>
    </el-drawer>
  </teleport>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref } from 'vue'

defineProps<{
  visible: boolean
}>()
const emit = defineEmits(['update:visible'])

const size = ref<number>(30)


// The `resize()` function is responsible for adjusting the size of the drawer component based on the
// window width. Here's a breakdown of how it works:
function resize() {
  if( window.innerWidth > 1000  &&  window.innerWidth < 1400){
    size.value = 30
  }
  else if (window.innerWidth >= 500  && window.innerWidth < 1000) {
    size.value = 50
  } 
 
  else if (window.innerWidth < 500) {
    size.value = 100
  }
}

//`nextTick(() => { window.addEventListener('resize', resize) })` is ensuring that the `resize` function, which adjusts the size of the drawer component
// based on the window width, is only added as an event listener after the next DOM update cycle.
onMounted(() => {
  
  nextTick(() => {
    window.addEventListener('resize', resize)
  })
})

// `onUnmounted(() => {
// window.removeEventListener('resize', resize) })` is removing the event listener for the `resize`
// function from the `window` object when the component is unmounted.
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<style scoped></style>
