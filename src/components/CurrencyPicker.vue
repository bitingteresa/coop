<script setup lang="ts">
import { useId } from 'vue';
import { CURRENCIES, CURRENCY_SYMBOLS, type Currency } from '@/types';

const selectedCurrency = defineModel<Currency>({ required: true });
const groupName = `${useId()}-currency`;
</script>

<template>
  <fieldset>
    <legend class="sr-only">Currency</legend>
    <label v-for="currency in CURRENCIES" :key="currency">
      <input
        class="sr-only"
        type="radio"
        :name="groupName"
        :value="currency"
        v-model="selectedCurrency"
      />
      <span aria-hidden="true">{{ CURRENCY_SYMBOLS[currency] }}</span>
      {{ currency }}
    </label>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: none;
  padding: 0;
  margin: 0;
  min-width: 0;
}

label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex: 1;
  min-height: var(--tap-target);
  padding: 0.25rem 1rem;
  background-color: var(--dove);
  color: var(--eggplant);
  border-radius: var(--radius);
  white-space: nowrap;
  cursor: pointer;
}

label:has(:checked) {
  background-color: var(--periwinkle);
  color: var(--dove);
  font-weight: 700;
}

label:has(:focus-visible) {
  outline: var(--focus-ring);
  outline-offset: var(--outline-offset);
}

@media (min-width: 400px) {
  fieldset {
    flex-direction: row;
  }
}
</style>
