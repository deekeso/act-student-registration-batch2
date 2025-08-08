<script lang="ts" setup>
import NavbarComp from '@/components/NavbarComp.vue'
</script>

<template>
  <header><NavbarComp /></header>
  <main><slot></slot></main>
  <footer></footer>
</template>
