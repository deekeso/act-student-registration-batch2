<template>
  <div class="carousel-banner">
    <el-carousel
      ref="carouselRef"
      :height="carouselHeight"
      :autoplay="true"
      :interval="5000"
      arrow="never"
    >
      <el-carousel-item v-for="(slide, index) in slides" :key="index">
        <img :src="slide.image" :alt="`Slide ${index + 1}`" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    <div class="navigation-buttons">
      <NavigationBtn direction="previous" @click="handlePrevious" class="prev-btn" />
      <NavigationBtn direction="next" @click="handleNext" class="next-btn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElCarousel } from 'element-plus'
import banner1 from '@/assets/banner/banner1.webp'
import NavigationBtn from '@/components/buttons/NavigationBtn.vue'

const slides = [{ image: banner1 }, { image: banner1 }, { image: banner1 }]

const carouselRef = ref<InstanceType<typeof ElCarousel> | null>(null)
const carouselHeight = '344px'

const handlePrevious = () => {
  if (carouselRef.value) {
    carouselRef.value.prev()
  }
}

const handleNext = () => {
  if (carouselRef.value) {
    carouselRef.value.next()
  }
}
</script>

<style scoped>
.carousel-banner {
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navigation-buttons {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.swiper-btn {
  pointer-events: auto;
}

.prev-btn {
  margin-left: 10px;
}

.next-btn {
  margin-right: 10px;
}

.el-carousel {
  /* border-radius: 15px; */
}
</style>
