<script lang="ts" setup>
import { ref, nextTick } from 'vue'

const trollLink = ref<HTMLElement | null>(null)

const runAway = async () => {
  await nextTick()

  const element = trollLink.value
  if (!element) {
    console.log('Element not found')
    return
  }

  console.log('Running away!')

  const padding = 50
  const maxX = window.innerWidth - element.offsetWidth - padding
  const maxY = window.innerHeight - element.offsetHeight - padding

  const newX = Math.random() * maxX + padding
  const newY = Math.random() * maxY + padding

  element.style.position = 'fixed'
  element.style.left = `${newX}px`
  element.style.top = `${newY}px`
  element.style.transform = 'none'
  element.style.zIndex = '1000'

  element.style.animation = 'shake 0.5s ease-in-out'

  setTimeout(() => {
    if (element) {
      element.style.animation = ''
    }
  }, 500)
}
</script>

<template>
  <div class="video-wrapper">
    <video autoplay muted loop playsinline class="background-video">
      <source src="/404NotFoundBg.mp4" type="video/mp4" />
    </video>
    <div class="page-body">
      <h1>404 NOT FOUND HAHAHAHAHHHA</h1>

      <div ref="trollLink" class="router-wrapper" @mouseover="runAway">
        <router-link class="router" to="/"> Go back </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.page-body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  z-index: 1;
  position: relative;
}

h1 {
  font-size: 80px;
}

.router-wrapper {
  display: inline-block;
  position: relative;
  z-index: 10;
}

.router {
  font-size: 100px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  display: block;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>
