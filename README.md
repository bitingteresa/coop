# coop

Split an amount in USD, EUR or GBP between BTC and ETH using live Coinbase rates. Starts at 70/30, and your inputs survive a refresh.

## Running it

```bash
npm install
npm run dev
npm run test:unit
npm run lint
npm run build
```

## Stack

Vue 3, Vite, TypeScript (strict), Vitest, ESLint/oxlint, Prettier.

I picked up Vue 3 and TypeScript for this, coming from React, so some of it may not be the most idiomatic Vue yet. (The semicolons are a React habit.)

## Decisions

Rates

- All three currencies are fetched in parallel every 60s, so switching currency is instant. I went with three requests (one per currency, as the brief describes) instead of one, because rates derived from the USD response can differ slightly from Coinbase's direct EUR and GBP rates.
- Each rate is validated, and a bad one throws instead of rendering garbage.
- Old requests get aborted so a slow response can't overwrite a newer one.
- If a refresh fails, the last good rates stay up with a notice. Retry only shows when there are no rates at all.

Amount and split

- Text input with `inputmode="decimal"` instead of `type="number"`, so `1,500` works and mobile still gets a number pad.
- Invalid or negative input shows an error but never reaches app state. No amount is `null`.
- One slider, since two coins always add up to 100.
- The split is done in whole cents and the last coin gets the leftover. A naive 50/50 of $0.05 shows $0.03 + $0.03.
- Coin quantities are truncated, not rounded, so you're never told to buy more than you can afford.

Persistence

- Saved to localStorage under `coop:v1` and validated on load. A bad amount only resets the amount.
- Still works if storage is blocked; it just won't remember anything.

Accessibility and layout

- Labeled inputs, keyboard support, visible focus, `aria-live` for errors and rate status.
- Respects reduced motion.
- Mobile-first, with breakpoints at 400px and 768px.

## Tests

Small on purpose, covering the money math and saved data:

- `calculateCoinAllocations`: split, conversion, cents always add up, edge cases
- `parseAppState`: valid, invalid, and partially valid saved data
- `fetchAllCryptoRates`: parses rates, throws on a missing one

## Limitations

- US formatting only. `1.500,00` isn't parsed, and `1,5` reads as 15.
- No cap on the amount. Huge numbers overflow the layout, and cent precision only holds up to about 90 trillion.
- The slider only works for two coins. The rest of the UI loops over the coin list.

## Next

- Pause polling when the tab is hidden
- Check whether deriving EUR and GBP from the USD response is accurate enough to cut it to one request
- Locale-aware formatting and parsing
- Component tests
