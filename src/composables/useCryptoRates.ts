import {
  getCurrentScope,
  onScopeDispose,
  readonly,
  shallowRef,
  type Ref,
} from 'vue';
import type { RatesByCurrency } from '@/types';
import { fetchAllCryptoRates } from '@/api/coinbase';

export function useCryptoRates({
  intervalMs = 60 * 1000,
}: { intervalMs?: number } = {}): {
  hasRatesError: Readonly<Ref<boolean>>;
  isLoadingRates: Readonly<Ref<boolean>>;
  rates: Readonly<Ref<RatesByCurrency | null>>;
  ratesUpdatedAt: Readonly<Ref<Date | null>>;
  loadRates: () => Promise<void>;
} {
  const rates = shallowRef<RatesByCurrency | null>(null);
  const isLoadingRates = shallowRef(false);
  const hasRatesError = shallowRef(false);
  const ratesUpdatedAt = shallowRef<Date | null>(null);
  let controller: AbortController | null = null;

  async function loadRates() {
    controller?.abort();
    const currentController = new AbortController();
    controller = currentController;

    isLoadingRates.value = true;

    try {
      const result = await fetchAllCryptoRates({
        signal: currentController.signal,
      });

      if (currentController.signal.aborted) return;

      rates.value = result;
      ratesUpdatedAt.value = new Date();
      hasRatesError.value = false;
    } catch (error) {
      if (currentController.signal.aborted) return;

      console.error('Failed to load crypto rates:', error);
      hasRatesError.value = true;
    } finally {
      if (!currentController.signal.aborted) {
        isLoadingRates.value = false;
      }
    }
  }

  loadRates();

  const timer = setInterval(loadRates, intervalMs);

  // Stop polling and cancel any request in flight when the component unmounts
  if (getCurrentScope()) {
    onScopeDispose(() => {
      controller?.abort();
      clearInterval(timer);
    });
  }

  return {
    hasRatesError: readonly(hasRatesError),
    isLoadingRates: readonly(isLoadingRates),
    rates: readonly(rates),
    ratesUpdatedAt: readonly(ratesUpdatedAt),
    loadRates,
  };
}
