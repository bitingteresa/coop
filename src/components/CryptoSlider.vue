<script setup lang="ts">
import { computed, useId } from 'vue';

const btcPercent = defineModel<number>({ required: true });
const inputId = `${useId()}-crypto-slider`;
const ethPercent = computed(() => 100 - btcPercent.value);
const splitText = computed(
  () => `${btcPercent.value}% Bitcoin and ${ethPercent.value}% Ethereum`,
);
</script>

<template>
  <div>
    <label :for="inputId" class="sr-only">Crypto split</label>
    <div class="split">
      <span
        >Bitcoin <span class="number">{{ btcPercent }}</span
        >%</span
      >
      <span
        ><span class="number">{{ ethPercent }}</span
        >% Ethereum</span
      >
      <input
        :id="inputId"
        type="range"
        min="0"
        max="100"
        step="1"
        v-model.number="btcPercent"
        :aria-valuetext="splitText"
        :style="{ '--fill': `${btcPercent}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background-color: var(--dove);
  border-radius: var(--radius);
  padding: 1rem;
  color: var(--eggplant);
}

.split > span:last-of-type {
  justify-self: end;
}

input {
  grid-column: 1 / -1;
  width: 100%;
  height: 0.75rem;
  margin: 0 0 0.75rem 0;
  appearance: none;
  background: linear-gradient(
    to right,
    var(--btc) var(--fill),
    var(--eth) var(--fill)
  );
  border-radius: var(--radius);
  cursor: pointer;
}

/* moving button for chrome, safari, edge */
input::-webkit-slider-thumb {
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--periwinkle);
  border: none;
  border-radius: 50%;
}

/* firefox */
input::-moz-range-thumb {
  box-sizing: border-box;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--periwinkle);
  border: none;
  border-radius: 50%;
}

/* more firefox extra  */
input::-moz-range-track {
  background: transparent;
}

input:focus-visible {
  outline: 2px solid var(--eggplant);
  outline-offset: 6px;
}
</style>
