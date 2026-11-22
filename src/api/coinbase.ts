import {
  COINS,
  CURRENCIES,
  type CryptoRates,
  type Currency,
  type RatesByCurrency,
} from '@/types';

const BASE_URL = 'https://api.coinbase.com/v2/exchange-rates?currency=';

async function fetchCryptoRates(
  currency: Currency,
  { signal }: { signal?: AbortSignal } = {},
): Promise<CryptoRates> {
  const result = await fetch(`${BASE_URL}${currency}`, { signal });

  if (!result.ok) {
    throw new Error(
      `Couldn't fetch ${currency} rates. Status ${result.status}`,
    );
  }

  const body = await result.json();
  const apiRates = body?.data?.rates;

  const entries = COINS.map((coin) => {
    const rate = Number(apiRates?.[coin.symbol]);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Unexpected ${coin.symbol} rate for ${currency}`);
    }

    return [coin.symbol, rate] as const;
  });

  return Object.fromEntries(entries) as CryptoRates;
}

export async function fetchAllCryptoRates({
  signal,
}: { signal?: AbortSignal } = {}): Promise<RatesByCurrency> {
  const rates = await Promise.all(
    CURRENCIES.map((currency) => fetchCryptoRates(currency, { signal })),
  );

  return Object.fromEntries(
    CURRENCIES.map((currency, i) => [currency, rates[i]]),
  ) as RatesByCurrency;
}
