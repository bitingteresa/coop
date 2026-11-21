<script setup lang="ts">
import { ref } from 'vue';
import { CURRENCY_SYMBOLS, type Currency } from '@/types';
import { formatUpdatedTime } from '@/utils';
import { useCryptoRates } from '@/composables/useCryptoRates';
import AmountInput from '@/components/AmountInput.vue';
import CryptoSlider from '@/components/CryptoSlider.vue';
import CurrencyPicker from '@/components/CurrencyPicker.vue';

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

const { rates, isLoadingRates, ratesError, ratesUpdatedAt, loadRates } =
  useCryptoRates();
</script>

<template>
  <h1>coop</h1>
  <p>made to split your nest egg</p>

  <AmountInput
    v-model="state.investableAmount"
    :symbol="CURRENCY_SYMBOLS[state.selectedCurrency]"
  />
  <CurrencyPicker v-model="state.selectedCurrency" />
  <CryptoSlider v-model="state.btcPercent" />

  <div aria-live="polite">
    <p v-if="isLoadingRates && !rates">Loading rates...</p>

    <div v-else-if="ratesError && !rates">
      <p>Couldn't load exchange rates.</p>
      <button @click="loadRates">Retry</button>
    </div>

    <p v-else-if="ratesError && rates">
      Couldn't refresh rates. Showing the last ones.
    </p>
  </div>

  <p v-if="ratesUpdatedAt">
    Rates as of {{ formatUpdatedTime(ratesUpdatedAt) }}
  </p>
</template>
