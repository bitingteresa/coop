export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
} as const;

export type Currency = keyof typeof CURRENCY_SYMBOLS;
