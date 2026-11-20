<script setup lang="ts">
import { ref } from 'vue';
import { CURRENCY_SYMBOLS, type Currency } from '@/types';
import AmountInput from '@/components/AmountInput.vue';
import CryptoSlider from '@/components/CryptoSlider.vue';

interface State {
  btcPercent: number;
  investableAmount: number | '';
  selectedCurrency: Currency;
}

const DEFAULTS: State = {
  btcPercent: 70,
  investableAmount: '',
  selectedCurrency: 'USD',
};

const state = ref<State>({ ...DEFAULTS });
</script>

<template>
  <h1>coop</h1>
  <p>made to split your nest egg</p>

  <AmountInput
    v-model="state.investableAmount"
    :symbol="CURRENCY_SYMBOLS[state.selectedCurrency]"
  />
  <CryptoSlider v-model="state.btcPercent" />
</template>
