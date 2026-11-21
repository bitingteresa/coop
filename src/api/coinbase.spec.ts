import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAllCryptoRates } from '@/api/coinbase';

// Pretend to be Coinbase: every request gets this response body.
function mockCoinbase(rates: Record<string, string>) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { rates } }),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchAllCryptoRates', () => {
  it('turns the string rates into numbers for every currency', async () => {
    mockCoinbase({ BTC: '0.00001', ETH: '0.0004' });

    const rates = await fetchAllCryptoRates();

    expect(rates.USD).toEqual({ BTC: 0.00001, ETH: 0.0004 });
    expect(rates.GBP).toEqual({ BTC: 0.00001, ETH: 0.0004 });
  });

  it('throws when a rate is missing', async () => {
    mockCoinbase({ BTC: '0.00001' }); // no ETH

    await expect(fetchAllCryptoRates()).rejects.toThrow(/Unexpected ETH rate/);
  });
});
