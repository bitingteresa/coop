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
  <div class="wrapper">
    <label :for="inputId">
      Investable amount<span class="sr-only"> in {{ currency }}</span>
    </label>

    <div class="control" :class="{ 'is-invalid': isInvalid }">
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
      <span aria-hidden="true" class="currency-code">{{ currency }}</span>
    </div>

    <p :id="errorId" class="error" aria-live="polite">
      {{ isInvalid ? "Investable amount can't be negative" : '' }}
    </p>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: clamp(1.5rem, 6vw, 2rem);
  background-color: var(--cloudy);
  border-radius: 0.5rem;
}

.control span {
  flex-shrink: 0;
  font-size: 0.6em;
  opacity: 0.8;
}

.control:focus-within {
  outline: 3px solid var(--golden-hour-highlight);
  outline-offset: 2px;
}

.control.is-invalid {
  box-shadow: inset 0 0 0 2px var(--carmine);
}

.currency-code {
  display: none;
}

label {
  font-size: 1.5rem;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
  outline: none;
  appearance: textfield;
}

/* the lil up/down arrows */
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.error {
  min-height: 1rem;
  margin: 0.5rem 0;
  color: var(--carmine);
}

@media (min-width: 400px) {
  .currency-code {
    display: inline;
  }
}
</style>
