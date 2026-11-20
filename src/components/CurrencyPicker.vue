<script setup lang="ts">
import { useId } from 'vue';
import { CURRENCIES, type Currency } from '@/types';

const selectedCurrency = defineModel<Currency>({ required: true });
const selectedCurrencyGroup = useId();
</script>

<template>
  <fieldset>
    <legend>Currency</legend>
    <label v-for="currency in CURRENCIES" :key="currency">
      <input
        type="radio"
        :name="selectedCurrencyGroup"
        :value="currency"
        v-model="selectedCurrency"
      />
      {{ currency }}
    </label>
  </fieldset>
</template>
