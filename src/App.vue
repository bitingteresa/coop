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

  return (
    typeof investableAmount === 'number' &&
    Math.round(investableAmount * 100) > 0
  );
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
    <div class="page">
      <header>
        <h1>coop</h1>
        <p>made to split your nest egg</p>
      </header>

      <main>
        <div class="row">
          <div class="col">
            <p :class="{ invisible: hasAmount }">
              Enter an amount to see your split.
            </p>
            <AmountInput
              v-model="state.investableAmount"
              :currency="state.selectedCurrency"
            />
            <CurrencyPicker v-model="state.selectedCurrency" />
            <div aria-live="polite">
              <p v-if="isLoadingRates && !rates">Loading rates...</p>

              <div v-else-if="ratesError && !rates">
                <p>Couldn't load exchange rates.</p>
                <button @click="loadRates">Retry</button>
              </div>

              <p v-else-if="ratesError">
                Couldn't refresh rates. Showing the last ones.
              </p>
            </div>
          </div>

          <div class="col">
            <Transition mode="out-in">
              <img
                v-if="!hasAmount"
                key="pigeon"
                class="pigeon"
                src="/images/pigeon.webp"
                alt=""
                width="529"
                height="924"
              />

              <div v-else class="results" key="results">
                <CryptoSlider v-model="state.btcPercent" />

                <div v-if="coinAllocations">
                  <AllocationCard
                    v-for="coinAllocation in coinAllocations"
                    :key="coinAllocation.symbol"
                    :coin-allocation="coinAllocation"
                    :currency="state.selectedCurrency"
                  />
                </div>

                <p v-if="ratesUpdatedAt">
                  Rates as of {{ formatUpdatedTime(ratesUpdatedAt) }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </main>

      <footer v-if="hasAmount">
        <button @click="resetState">Reset data</button>
      </footer>
    </div>
  </GrainBackground>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.pigeon {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 60vh;
  width: auto;
  margin: 0 auto;
  translate: 15% 0;
}

.results.v-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.results.v-enter-from {
  opacity: 0;
  transform: translateY(2rem);
}

.results.v-leave-active {
  transition: opacity 0.2s ease;
}

.results.v-leave-to {
  opacity: 0;
}

.pigeon.v-leave-active {
  animation: fly-away 1s ease-in forwards;
}

.pigeon.v-enter-active {
  animation: fly-away 0.8s ease-out reverse;
}

@keyframes fly-away {
  0% {
    transform: translate(0, 0) rotate(0);
  }

  20% {
    transform: translate(-0.5rem, 0.25rem) rotate(-4deg);
  }

  100% {
    transform: translate(100vw, -40vh) rotate(12deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pigeon.v-enter-active,
  .pigeon.v-leave-active {
    animation: none;
  }

  .results.v-enter-active,
  .results.v-leave-active {
    transition: none;
  }
}

@media (min-width: 768px) {
  .page {
    padding-inline: 2rem;
  }

  .row {
    flex-direction: row;
    align-items: flex-start;
  }

  .col {
    flex: 1;
    min-width: 0;
  }
}
</style>
