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

function splitIntoCents(amount: number, percents: number[]): number[] {
  const totalCents = Math.round(amount * 100);
  let allocatedCents = 0;

  return percents.map((percent, i) => {
    const isLast = i === percents.length - 1;
    const cents = isLast
      ? Math.max(0, totalCents - allocatedCents)
      : Math.min(
          totalCents - allocatedCents,
          Math.round((totalCents * percent) / 100),
        );

    allocatedCents += cents;

    return cents / 100;
  });
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

  const percents = COINS.map((coin) => clampPercent(coinPercents[coin.symbol]));
  const costs = splitIntoCents(investableAmount, percents);

  return COINS.map((coin, i) => {
    const percent = percents[i] ?? 0;
    const cost = costs[i] ?? 0;
    const rate = cryptoRates[coin.symbol];

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
