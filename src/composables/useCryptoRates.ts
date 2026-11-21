import { ref, getCurrentScope, onScopeDispose, type Ref } from 'vue';
import type { RatesByCurrency } from '@/types';
import { fetchAllCryptoRates } from '@/api/coinbase';

export function useCryptoRates({
  intervalMs = 60 * 1000,
}: { intervalMs?: number } = {}): {
  isLoadingRates: Ref<boolean>;
  rates: Ref<RatesByCurrency | null>;
  ratesError: Ref<string | null>;
  ratesUpdatedAt: Ref<Date | null>;
  loadRates: () => Promise<void>;
} {
  const rates = ref<RatesByCurrency | null>(null);
  const isLoadingRates = ref(false);
  const ratesError = ref<string | null>(null);
  const ratesUpdatedAt = ref<Date | null>(null);
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
      ratesError.value = null;
    } catch (e) {
      if (currentController.signal.aborted) return;

      ratesError.value =
        e instanceof Error ? e.message : 'Something went wrong';
    } finally {
      if (!currentController.signal.aborted) {
        isLoadingRates.value = false;
      }
    }
  }

  loadRates();

  const timer = setInterval(loadRates, intervalMs);

  // cleanup to stop interval & cancel requests when component unmounts
  if (getCurrentScope()) {
    onScopeDispose(() => {
      controller?.abort();
      clearInterval(timer);
    });
  }

  return {
    isLoadingRates,
    rates,
    ratesError,
    ratesUpdatedAt,
    loadRates,
  };
}
