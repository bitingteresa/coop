import type { COINS, CURRENCIES } from '@/constants';

export type Coin = (typeof COINS)[number];

export type CoinSymbol = Coin['symbol'];

export type CoinPercents = Record<CoinSymbol, number>;

export type CoinAllocation = {
  cost: number;
  name: Coin['name'];
  percent: number;
  price: number;
  quantity: number;
  symbol: CoinSymbol;
};

export type Currency = (typeof CURRENCIES)[number]['code'];

export type CryptoRates = Record<CoinSymbol, number>;

export type RatesByCurrency = Record<Currency, CryptoRates>;

export type AppState = {
  btcPercent: number;
  investableAmount: number | null;
  selectedCurrency: Currency;
};

export type CoinbaseRatesResponse = {
  data?: { rates?: Record<string, string> };
};

export type ParsedAmount =
  { kind: 'empty' } | { kind: 'invalid' } | { kind: 'number'; value: number };
