import type { ParsedAmount } from '@/types';

export function getAmountError(parsed: ParsedAmount): string {
  if (parsed.kind === 'invalid') {
    return 'Amount must be a valid number like 1,500.25';
  }

  if (parsed.kind === 'number' && parsed.value < 0) {
    return "Amount can't be negative";
  }

  return '';
}
export function hasPayableAmount(amount: number | null): amount is number {
  return amount !== null && Number.isFinite(amount) && toCents(amount) > 0;
}

export function parseAmountInput(text: string): ParsedAmount {
  const cleaned = text.replace(/[,\s]/g, '');

  if (cleaned === '') return { kind: 'empty' };

  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return { kind: 'invalid' };

  return { kind: 'number', value: Number(cleaned) };
}

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
