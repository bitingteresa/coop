export const COINS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
] as const;

export type CoinSymbol = (typeof COINS)[number]['symbol'];

export type CoinPercents = Record<CoinSymbol, number>;

export type CoinAllocation = {
  cost: number;
  name: string;
  percent: number;
  price: number;
  quantity: number;
  symbol: CoinSymbol;
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;

export type Currency = (typeof CURRENCIES)[number];

export type CryptoRates = Record<CoinSymbol, number>;

export type RatesByCurrency = Record<Currency, CryptoRates>;

export type AppState = {
  btcPercent: number;
  investableAmount: number | '';
  selectedCurrency: Currency;
};
