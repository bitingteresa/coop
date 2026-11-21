<script setup lang="ts">
import { computed } from 'vue';
import type { AppState, CoinPercents } from '@/types';
import {
  calculateCoinAllocations,
  formatUpdatedTime,
  parseAppState,
} from '@/utils';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { useCryptoRates } from '@/composables/useCryptoRates';
import AllocationCard from '@/components/AllocationCard.vue';
import AmountInput from '@/components/AmountInput.vue';
import CryptoSlider from '@/components/CryptoSlider.vue';
import CurrencyPicker from '@/components/CurrencyPicker.vue';
import GrainBackground from '@/components/GrainBackground.vue';

const DEFAULTS: AppState = {
  btcPercent: 70,
  investableAmount: '',
  selectedCurrency: 'USD',
};

const { state, resetState } = useLocalStorage(
  'coop:v1',
  DEFAULTS,
  parseAppState,
);

const { rates, isLoadingRates, ratesError, ratesUpdatedAt, loadRates } =
  useCryptoRates();

const hasAmount = computed(() => {
  const { investableAmount } = state.value;

  return typeof investableAmount === 'number' && investableAmount > 0;
});
const currencyRates = computed(
  () => rates.value?.[state.value.selectedCurrency] ?? null,
);
const coinPercents = computed<CoinPercents>(() => ({
  BTC: state.value.btcPercent,
  ETH: 100 - state.value.btcPercent,
}));
const coinAllocations = computed(() =>
  calculateCoinAllocations(
    state.value.investableAmount,
    coinPercents.value,
    currencyRates.value,
  ),
);
</script>

<template>
  <GrainBackground>
    <header>
      <h1>coop</h1>
      <p>made to split your nest egg</p>
    </header>

    <main>
      <AmountInput
        v-model="state.investableAmount"
        :currency="state.selectedCurrency"
      />
      <CurrencyPicker v-model="state.selectedCurrency" />
      <CryptoSlider v-if="hasAmount" v-model="state.btcPercent" />

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

      <div v-if="rates">
        <p v-if="!coinAllocations">Enter an amount to see your split.</p>

        <div v-else>
          <AllocationCard
            v-for="coinAllocation in coinAllocations"
            :key="coinAllocation.symbol"
            :coin-allocation="coinAllocation"
            :currency="state.selectedCurrency"
          />
        </div>

        <p v-if="ratesUpdatedAt && hasAmount">
          Rates as of {{ formatUpdatedTime(ratesUpdatedAt) }}
        </p>
      </div>

      <footer>
        <button v-if="hasAmount" @click="resetState">Reset data</button>
      </footer>
    </main>
  </GrainBackground>
</template>
