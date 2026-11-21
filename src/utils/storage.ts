import { CURRENCIES, type AppState, type Currency } from '@/types';

function isCurrency(value: unknown): value is Currency {
  return CURRENCIES.includes(value as Currency);
}

function isAmount(value: unknown): value is number | '' {
  return (
    value === '' ||
    (typeof value === 'number' && Number.isFinite(value) && value >= 0)
  );
}

function isPercent(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}

export function parseAppState(raw: unknown): AppState | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const { investableAmount, selectedCurrency, btcPercent } = raw as Record<
    string,
    unknown
  >;

  if (
    !isAmount(investableAmount) ||
    !isCurrency(selectedCurrency) ||
    !isPercent(btcPercent)
  ) {
    return null;
  }

  return {
    btcPercent,
    investableAmount,
    selectedCurrency,
  };
}
