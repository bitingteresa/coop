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
  <section :aria-labelledby="headingId">
    <h2 :id="headingId">
      {{ coinAllocation.name }} · {{ Math.round(coinAllocation.percent) }}%
    </h2>
    <p>
      Buy {{ formatCryptoQuantity(coinAllocation.quantity) }}
      {{ coinAllocation.symbol }}
    </p>
    <p>for {{ formatPrice(coinAllocation.cost, currency) }}</p>
    <p>
      1 {{ coinAllocation.symbol }} =
      {{ formatPrice(coinAllocation.price, currency) }}
    </p>
  </section>
</template>
