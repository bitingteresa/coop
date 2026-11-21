import {
  COINS,
  type CoinAllocation,
  type CoinPercents,
  type CryptoRates,
} from '@/types';

function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0;

  return Math.min(100, Math.max(0, percent));
}

// For each coin in COINS:
//   cost     = amount × percent / 100 -> the total amount split into this coin
//   quantity = cost × rate -> how many coins you can buy
//   price    = 1 / rate -> what 1 coin costs
export function calculateCoinAllocations(
  investableAmount: number | '',
  coinPercents: CoinPercents,
  cryptoRates: CryptoRates | null,
): CoinAllocation[] | null {
  if (
    cryptoRates === null ||
    typeof investableAmount !== 'number' ||
    !Number.isFinite(investableAmount) ||
    investableAmount <= 0
  ) {
    return null;
  }

  return COINS.map((coin) => {
    const percent = clampPercent(coinPercents[coin.symbol]);
    const rate = cryptoRates[coin.symbol];
    const cost = (investableAmount * percent) / 100;

    return {
      cost,
      name: coin.name,
      percent,
      price: 1 / rate,
      quantity: cost * rate,
      symbol: coin.symbol,
    };
  });
}
