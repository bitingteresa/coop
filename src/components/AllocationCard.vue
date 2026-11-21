<script setup lang="ts">
import { useId } from 'vue';
import type { CoinAllocation, Currency } from '@/types';

defineProps<{
  coinAllocation: CoinAllocation;
  currency: Currency;
}>();

const headingId = useId();
</script>

<template>
  <section :aria-labelledby="headingId">
    <h2 :id="headingId">
      {{ Math.round(coinAllocation.percent) }}% {{ coinAllocation.name }}
    </h2>
    <p>
      Buy {{ coinAllocation.quantity }}
      {{ coinAllocation.symbol }}
    </p>
    <p>for {{ coinAllocation.cost }}</p>
    <p>
      1 {{ coinAllocation.symbol }} =
      {{ coinAllocation.price }}
    </p>
  </section>
</template>
