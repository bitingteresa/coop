<script setup lang="ts">
defineProps<{ color?: string }>();
</script>

<template>
  <svg viewBox="0 0 30 40" aria-hidden="true" :style="{ color }">
    <path
      d="M15 1C7 1 1 14 1 24c0 8.8 6.3 15 14 15s14-6.2 14-15C29 14 23 1 15 1Z"
      fill="currentColor"
      stroke="var(--dove)"
      stroke-width="0.75"
    />
  </svg>
</template>
