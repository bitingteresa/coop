export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;

export type Currency = (typeof CURRENCIES)[number];
