<script setup lang="ts">
import { computed } from 'vue';
import { COINS } from '@/constants';
import type { AppState, CoinPercents } from '@/types';
import {
  calculateCoinAllocations,
  formatUpdatedTime,
  hasPayableAmount,
  parseAppState,
} from '@/utils';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { useCryptoRates } from '@/composables/useCryptoRates';
import AllocationCard from '@/components/AllocationCard.vue';
import AmountInput from '@/components/AmountInput.vue';
import CryptoEgg from '@/components/CryptoEgg.vue';
import CryptoSlider from '@/components/CryptoSlider.vue';
import CurrencyPicker from '@/components/CurrencyPicker.vue';
import GrainBackground from '@/components/GrainBackground.vue';
import pigeonUrl from '@/assets/pigeon.webp';

const DEFAULTS: AppState = {
  btcPercent: 70,
  investableAmount: null,
  selectedCurrency: 'USD',
};

const { state, resetState } = useLocalStorage(
  'coop:v1',
  DEFAULTS,
  parseAppState,
);

const { hasRatesError, isLoadingRates, rates, ratesUpdatedAt, loadRates } =
  useCryptoRates();

const hasAmount = computed(() =>
  hasPayableAmount(state.value.investableAmount),
);
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
        <h1 class="title">coop</h1>
        <p class="subtitle">split your nest egg</p>
      </header>

      <main>
        <div class="row">
          <div class="col">
            <AmountInput
              v-model="state.investableAmount"
              :currency="state.selectedCurrency"
            >
              <template #action>
                <button
                  @click="resetState"
                  class="text-btn"
                  :class="{ 'is-hidden': !hasAmount }"
                >
                  Start over
                </button>
              </template>
            </AmountInput>
            <CurrencyPicker v-model="state.selectedCurrency" />

            <div aria-live="polite">
              <p v-if="isLoadingRates && !rates">Loading rates...</p>

              <div v-else-if="hasRatesError && !rates" class="alert">
                <p>Couldn't load exchange rates.</p>
                <button @click="loadRates" class="btn">Retry</button>
              </div>

              <p v-else-if="hasRatesError">
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
                :src="pigeonUrl"
                alt=""
                width="529"
                height="924"
              />

              <div v-else class="results" key="results">
                <div class="eggs">
                  <CryptoEgg
                    v-for="coin in COINS"
                    :key="coin.symbol"
                    class="egg"
                    :data-coin="coin.symbol"
                    :style="{ '--share': coinPercents[coin.symbol] / 100 }"
                  />
                </div>
                <CryptoSlider v-model="state.btcPercent" />

                <div v-if="coinAllocations" class="cards">
                  <AllocationCard
                    v-for="coinAllocation in coinAllocations"
                    :key="coinAllocation.symbol"
                    :coin-allocation="coinAllocation"
                    :currency="state.selectedCurrency"
                  />
                </div>

                <p v-if="ratesUpdatedAt" class="updated">
                  Rates as of
                  <span class="number">{{
                    formatUpdatedTime(ratesUpdatedAt)
                  }}</span>
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </main>
    </div>
  </GrainBackground>
</template>

<style scoped>
header {
  text-align: center;
  margin-bottom: 1rem;
}

main {
  flex: 1;
}

.page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 1rem;
}

.title {
  font-size: clamp(5rem, 30vw, 10rem);
  font-family: 'Fascinate', system-ui;
  line-height: 1.25;
  margin: 0;
}

.subtitle {
  margin-top: 0.5rem;
  font-size: 1.5rem;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.is-hidden {
  visibility: hidden;
  opacity: 0;
}

.pigeon {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 30vh;
  width: auto;
  margin-inline: auto;
  translate: 15% 0;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.eggs {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1.5rem;
}

.egg {
  width: 4.5rem;
  scale: calc(0.4 + 0.6 * var(--share));
  transform-origin: bottom center;
  transition: scale 0.2s ease;
}

.updated {
  margin: 0;
}

.cards {
  display: grid;
  gap: 1rem;
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

@media (min-width: 768px) {
  header {
    margin-bottom: 3rem;
  }

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

  .pigeon {
    max-height: 50vh;
  }

  .egg {
    width: 8rem;
  }

  .cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
