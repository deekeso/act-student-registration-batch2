<template>
  <component :is="tag" :class="computedClass" :style="computedStyle" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (v: string) =>
      [
        'section-header',
        'card-title',
        'card-price',
        'card-old-price',
        'listing-badge',
        'listing-ratings',
        'listing-brand-link',
        'listing-price-content',
        'listing-info-label',
        'listing-info-description',
        'default',
        'empty',
      ].includes(v),
  },
  tag: {
    type: String,
    default: 'span',
  },
  color: {
    type: String,
    default: '',
  },
  bold: {
    type: Boolean,
    default: false,
  },
  strike: {
    type: Boolean,
    default: false,
  },
})

const computedClass = computed(() => [
  'text-style',
  `text-style--${props.variant}`,
  { 'text-style--bold': props.bold, 'text-style--strike': props.strike },
])

const computedStyle = computed(() => ({
  color: props.color || undefined,
}))
</script>

<style scoped>
.text-style--default {
  font-size: 14px;
  color: #333;
}

.text-style--section-header {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #424242;
}

.text-style--card-title {
  font-size: 15px;
  font-weight: 600;
}

.text-style--card-price {
  color: #e53935;
  font-size: 16px;
  font-weight: 600;
}

.text-style--card-old-price {
  color: #aaa;
  text-decoration: line-through;
  font-size: 13px;
}

.text-style--listing-badge {
  background: #ffeb3b;
  color: #333;
  font-size: 18px;
  border-radius: 0.25em;
  padding: 0.15em 0.4em;
  font-weight: 500;
}

.text-style--listing-badge-desc {
  color: #333;
  font-size: 18px;
  border-radius: 0.25em;
  padding: 0.15em 0.4em;
  font-weight: 500;
}

.text-style--listing-ratings {
  color: #ff9800;
  font-size: 16px;
  font-weight: 500;
}

.text-style--listing-brand-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-size: 16px;
}

.text-style--listing-price-content {
  color: #e53935;
  font-size: 20px;
  font-weight: 600;
}

.text-style--listing-info-label {
  font-size: 16px;
  color: #666;
  font-weight: 600;
}

.text-style--listing-info-description {
  font-size: 16px;
  color: #888;
}

.text-style--empty {
  font-size: 18px;
  font-weight: 600;
  color: #888;
}

.text-style--bold {
  font-weight: bold;
}
.text-style--strike {
  text-decoration: line-through;
}
</style>
