<script setup lang="ts">
import { computed } from 'vue';

const btcPercent = defineModel<number>({ required: true });
const ethPercent = computed(() => 100 - btcPercent.value);
const splitText = computed(
  () => `${btcPercent.value}% Bitcoin and ${ethPercent.value}% Ethereum`,
);
</script>

<template>
  <div>
    <label for="btc-percent-input">Crypto split</label>
    <div>
      <span>Bitcoin {{ btcPercent }}%</span>
      <input
        id="btc-percent-input"
        type="range"
        min="0"
        max="100"
        step="1"
        v-model.number="btcPercent"
        :aria-valuetext="splitText"
      />
      <span>{{ ethPercent }}% Ethereum</span>
    </div>
  </div>
</template>
