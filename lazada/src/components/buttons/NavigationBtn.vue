<template>
  <div class="swiper-btn">
    <el-button :href="href" @click="$emit('click')" :class="direction" :aria-label="ariaLabel">
      <el-icon>
        <ArrowRight v-if="direction === 'next'" />
        <ArrowLeft v-else />
      </el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElButton, ElIcon } from 'element-plus';
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue';

const props = defineProps<{
  direction: 'next' | 'previous';
  href?: string;
}>();

defineEmits(['click']);

const ariaLabel = computed(() => (props.direction === 'next' ? 'Next slide' : 'Previous slide'));
</script>

<style scoped>
.swiper-btn {
  display: inline-block;
}

.el-button {
  border-radius: 20px;
  padding: 8px;
  background-color: RGB(134, 142, 150, .70);
}

.el-icon svg {
  color: white;
}


</style>
