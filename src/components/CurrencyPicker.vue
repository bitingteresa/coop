<script setup lang="ts">
import { useId } from 'vue';
import { CURRENCIES, type Currency } from '@/types';

const selectedCurrency = defineModel<Currency>({ required: true });
const groupName = `${useId()}-currency`;
</script>

<template>
  <fieldset>
    <legend class="sr-only">Currency</legend>
    <label v-for="currency in CURRENCIES" :key="currency">
      <input
        type="radio"
        :name="groupName"
        :value="currency"
        v-model="selectedCurrency"
      />
      {{ currency }}
    </label>
  </fieldset>
</template>
