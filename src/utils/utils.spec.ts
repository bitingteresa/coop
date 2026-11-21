import { describe, expect, it } from 'vitest';
import { calculateCoinAllocations, parseAppState } from '@/utils';

const RATES = { BTC: 0.00001, ETH: 0.0004 }; // 1 BTC = $100,000, 1 ETH = $2,500

describe('calculateCoinAllocations', () => {
  it('splits the amount by percent and converts it to coins', () => {
    const result = calculateCoinAllocations(1000, { BTC: 70, ETH: 30 }, RATES);

    expect(result?.[0]?.cost).toBe(700);
    expect(result?.[0]?.quantity).toBeCloseTo(0.007);
    expect(result?.[1]?.cost).toBe(300);
    expect(result?.[1]?.quantity).toBeCloseTo(0.12);
  });

  it('splits in whole cents that add up to the amount', () => {
    const result = calculateCoinAllocations(0.05, { BTC: 50, ETH: 50 }, RATES);
    const costs = result?.map((a) => a.cost);

    // a naive split gives 0.025 + 0.025, which both display as $0.03
    expect(costs).toEqual([0.03, 0.02]);
  });

  it('never allocates more than the amount', () => {
    for (const amount of [0.01, 0.05, 33.33, 99.99, 1234.567]) {
      for (let btc = 0; btc <= 100; btc++) {
        const result = calculateCoinAllocations(
          amount,
          { BTC: btc, ETH: 100 - btc },
          RATES,
        );
        const totalCents = Math.round(
          (result ?? []).reduce((sum, a) => sum + a.cost, 0) * 100,
        );

        expect(totalCents).toBe(Math.round(amount * 100));
      }
    }
  });

  it('returns null when there is no amount', () => {
    expect(
      calculateCoinAllocations('', { BTC: 70, ETH: 30 }, RATES),
    ).toBeNull();
  });

  it('returns null before rates have loaded', () => {
    expect(
      calculateCoinAllocations(1000, { BTC: 70, ETH: 30 }, null),
    ).toBeNull();
  });
});

describe('parseAppState', () => {
  it('accepts valid saved data', () => {
    const saved = {
      btcPercent: 60,
      investableAmount: 500,
      selectedCurrency: 'EUR',
    };

    expect(parseAppState(saved)).toEqual(saved);
  });

  it('rejects invalid saved data', () => {
    expect(
      parseAppState({
        btcPercent: 150,
        investableAmount: 500,
        selectedCurrency: 'EUR',
      }),
    ).toBeNull();
    expect(parseAppState('junk')).toBeNull();
  });
});
