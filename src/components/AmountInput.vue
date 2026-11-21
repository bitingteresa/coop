<script setup lang="ts">
import { computed, useId } from 'vue';
import { CURRENCY_SYMBOLS, type Currency } from '@/types';

const props = defineProps<{ currency: Currency }>();
const amount = defineModel<number | ''>({ required: true });

const id = useId();
const inputId = `${id}-investable-amount-input`;
const errorId = `${id}-investable-amount-error`;

const symbol = computed(() => CURRENCY_SYMBOLS[props.currency]);
const isInvalid = computed(
  () => typeof amount.value === 'number' && amount.value < 0,
);
</script>

<template>
  <div>
    <label :for="inputId">Investable amount ({{ currency }})</label>
    <span aria-hidden="true">{{ symbol }}</span>
    <input
      :id="inputId"
      type="number"
      min="0"
      step="any"
      inputmode="decimal"
      v-model.number="amount"
      :aria-invalid="isInvalid"
      :aria-describedby="isInvalid ? errorId : undefined"
    />
    <p :class="{ invisible: !isInvalid }" :id="errorId">
      Investable amount can't be negative
    </p>
  </div>
</template>
