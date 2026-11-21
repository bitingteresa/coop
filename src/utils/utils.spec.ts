import { describe, expect, it } from 'vitest';
import { calculateCoinAllocations } from '@/utils';

const RATES = { BTC: 0.00001, ETH: 0.0004 }; // 1 BTC = $100,000, 1 ETH = $2,500

describe('calculateCoinAllocations', () => {
  it('splits the amount by percent and converts it to coins', () => {
    const result = calculateCoinAllocations(1000, { BTC: 70, ETH: 30 }, RATES);

    expect(result?.[0]?.cost).toBe(700);
    expect(result?.[0]?.quantity).toBeCloseTo(0.007);
    expect(result?.[1]?.cost).toBe(300);
    expect(result?.[1]?.quantity).toBeCloseTo(0.12);
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
