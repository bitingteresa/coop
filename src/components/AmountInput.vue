<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import { CURRENCY_SYMBOLS, type Currency } from '@/types';
import { getAmountError, parseAmountInput } from '@/utils';

const props = defineProps<{ currency: Currency }>();
const amount = defineModel<number | ''>({ required: true });

const text = ref(String(amount.value));

const symbol = computed(() => CURRENCY_SYMBOLS[props.currency]);
const parsed = computed(() => parseAmountInput(text.value));
const errorMessage = computed(() => getAmountError(parsed.value));
const isInvalid = computed(() => errorMessage.value !== '');
const validAmount = computed(() =>
  isInvalid.value ? '' : (parsed.value ?? ''),
);

const id = useId();
const inputId = `${id}-investable-amount-input`;
const errorId = `${id}-investable-amount-error`;

function onInput(event: Event) {
  text.value = (event.target as HTMLInputElement).value;
  amount.value = validAmount.value;
}

watch(amount, (value) => {
  if (value !== validAmount.value) text.value = String(value);
});
</script>

<template>
  <div class="wrapper">
    <div class="label-row">
      <label :for="inputId">
        Investable amount<span class="sr-only"> in {{ currency }}</span>
      </label>

      <slot name="action" />
    </div>

    <div class="control" :class="{ 'is-invalid': isInvalid }">
      <span aria-hidden="true">{{ symbol }}</span>
      <input
        :id="inputId"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        :value="text"
        @input="onInput"
        :aria-invalid="isInvalid"
        :aria-describedby="isInvalid ? errorId : undefined"
      />
      <span aria-hidden="true" class="currency-code">{{ currency }}</span>
    </div>

    <p
      :id="errorId"
      class="error"
      :class="{ alert: isInvalid }"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: clamp(1.5rem, 6vw, 2rem);
  background-color: var(--dove);
  color: var(--eggplant);
  border-radius: var(--radius);
}

.control span {
  flex-shrink: 0;
  font-size: 0.6em;
  opacity: var(--muted);
}

.control:focus-within {
  outline: var(--focus-ring);
  outline-offset: var(--outline-offset);
}

.control.is-invalid {
  box-shadow: inset 0 0 0 2px var(--carmine);
}

.currency-code {
  display: none;
}

label {
  font-size: 1.5rem;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0.1em 0;
  font: inherit;
  font-family: var(--font-numbers);
  line-height: 1.3;
  color: inherit;
  background-color: transparent;
  border: none;
  outline: none;
}

.error {
  margin: 0;
}

.error.alert {
  margin-top: 0.5rem;
}

@media (min-width: 400px) {
  .currency-code {
    display: inline;
  }
}
</style>
