import { CURRENCY_CODES } from '@/constants';
import type { AppState, Currency } from '@/types';

function isCurrency(value: unknown): value is Currency {
  return CURRENCY_CODES.includes(value as Currency);
}

function isAmount(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === 'number' && Number.isFinite(value) && value >= 0)
  );
}

function isPercent(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
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

  if (!isCurrency(selectedCurrency) || !isPercent(btcPercent)) return null;

  return {
    btcPercent,
    investableAmount: isAmount(investableAmount) ? investableAmount : null,
    selectedCurrency,
  };
}
