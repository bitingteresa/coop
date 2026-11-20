<script setup lang="ts">
import { computed } from 'vue';

defineProps<{ symbol: string }>();
const amount = defineModel<number | ''>({ required: true });
const isInvalid = computed(
  () => typeof amount.value === 'number' && amount.value < 0,
);
</script>

<template>
  <div>
    <label for="investable-amount-input">Investable amount</label>
    <span aria-hidden="true">{{ symbol }}</span>
    <input
      id="investable-amount-input"
      type="number"
      min="0"
      step="any"
      v-model.number="amount"
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? 'investable-amount-error' : undefined"
    />
    <p v-if="isInvalid" id="investable-amount-error">
      Investable amount can't be negative
    </p>
  </div>
</template>
