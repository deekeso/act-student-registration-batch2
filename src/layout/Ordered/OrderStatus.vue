<template>
  <div class="steps-container">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="Pending" />
      <el-step title="Completed" />
    </el-steps>
    <el-button @click="next" round class="step-button">Order Received</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ order: { status: 'Pending' | 'Completed' } | null }>()
const emit = defineEmits(['status-change'])

const active = computed({
  get: () => (props.order?.status === 'Completed' ? 2 : 1),
  set: (val: number) => {
    if (!props.order) return
    const newStatus = val === 2 ? 'Completed' : 'Pending'
    emit('status-change', newStatus)
  }
})

function next() {
  if (!props.order) return
  active.value = active.value === 1 ? 2 : 1
}
</script>

<style scoped>
.steps-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  background: var(--el-bg-color, #fff);
  border: solid 1px #d9d9d9;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin: 10px auto;
}

.el-steps {
  width: 100%;
  margin-bottom: 32px;
}

.el-step.is-success .el-step__icon {
  background: var(--el-color-success, #67C23A);
  color: #fff;
}
</style>
