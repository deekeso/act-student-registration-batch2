<template>
  <div class="banner" style="margin: 16px">
    <h2>Banner Container</h2>
    <TheBanner />

    <TextStyle variant="section-header">Section Header </TextStyle>
    <TextStyle variant="card-title">Card Title </TextStyle>
    <TextStyle variant="card-price">₱100.00 </TextStyle>
    <TextStyle variant="card-old-price" strike>₱200.00 </TextStyle>
    <TextStyle variant="listing-badge">NEW </TextStyle>
    <TextStyle variant="listing-badge-desc">PRODUCT TITLE HERE </TextStyle>
    <TextStyle variant="listing-ratings">4.5 ★ </TextStyle>
    <TextStyle variant="listing-brand-link" tag="a" href="#">Brand </TextStyle>
    <TextStyle variant="listing-price-content">₱99.00 </TextStyle>
    <TextStyle variant="listing-info-label">Label </TextStyle>
    <TextStyle variant="listing-info-description">Description </TextStyle>

    <h2 style="margin: 10px">Cards</h2>
    <el-row :gutter="0">
      <el-col :span="3" v-for="product in products.slice(0, 3)" :key="product.id">
        <DashboardCard
          :image="product.image || ''"
          :name="product.name || ''"
          :price="product.price ?? 0"
          :oldPrice="product.oldPrice"
          :rating="product.rating ?? 0"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { products } from '@/constants'
import TextStyle from './TextStyle.vue'
import DashboardCard from './cards/DashboardCard.vue'
import TheBanner from '../layout/Dashboard/TheBanner.vue'
</script>

<style scoped></style>
