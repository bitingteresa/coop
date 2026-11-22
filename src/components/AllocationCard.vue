<script setup lang="ts">
import { useId } from 'vue';
import type { CoinAllocation, Currency } from '@/types';
import { formatPrice, formatCryptoQuantity } from '@/utils';

defineProps<{
  coinAllocation: CoinAllocation;
  currency: Currency;
}>();

const headingId = useId();
</script>

<template>
  <section
    :aria-labelledby="headingId"
    class="card"
    :data-coin="coinAllocation.symbol"
  >
    <h2 :id="headingId" class="heading">
      {{ coinAllocation.percent }}% of {{ coinAllocation.name }}
    </h2>
    <p class="row">
      <span class="label">Buy</span>
      <span class="value"
        >{{ formatCryptoQuantity(coinAllocation.quantity) }}
        <span class="symbol">{{ coinAllocation.symbol }}</span>
      </span>
    </p>
    <p class="row">
      <span class="label">Cost</span>
      <span>{{ formatPrice(coinAllocation.cost, currency) }}</span>
    </p>
    <p class="price">
      1 {{ coinAllocation.symbol }} =
      {{ formatPrice(coinAllocation.price, currency) }}
    </p>
  </section>
</template>

<style scoped>
.card[data-coin='BTC'] {
  --band-color: var(--btc);
}

.card[data-coin='ETH'] {
  --band-color: var(--eth);
}

.card {
  --pad: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: var(--pad);
  background-color: var(--dove);
  border-radius: var(--radius);
  color: var(--eggplant);
  overflow: hidden;
}

.heading {
  margin: calc(var(--pad) * -1) calc(var(--pad) * -1) 0.75rem;
  padding: 0.75rem var(--pad);
  background-color: var(--band-color);
  color: var(--dove);
  font-size: 1rem;
}

.row {
  margin: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.label {
  font-size: var(--text-sm);
  opacity: var(--muted);
}

.value {
  font-family: var(--font-numbers);
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.symbol {
  font-size: var(--text-sm);
  opacity: var(--muted);
}

.price {
  margin: 1.25rem 0 0;
  font-size: var(--text-sm);
  opacity: var(--muted);
}

/* 768px: App puts the cards side by side in a half-width column */
@media (min-width: 768px) {
  .card {
    --pad: 1rem;
  }

  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .value {
    font-size: 1.125rem;
  }
}
</style>
