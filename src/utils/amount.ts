export function toCents(amount: number) {
  return Math.round(amount * 100);
}

export function hasPayableAmount(amount: number | ''): amount is number {
  return (
    typeof amount === 'number' && Number.isFinite(amount) && toCents(amount) > 0
  );
}

export function parseAmountInput(text: string): number | '' | null {
  const cleaned = text.replace(/[,\s]/g, '');

  if (cleaned === '') return '';

  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;

  return Number(cleaned);
}

export function getAmountError(parsed: number | '' | null): string {
  if (parsed === null) return 'Amount must be a valid number like 1,500.25';

  if (typeof parsed === 'number' && parsed < 0) {
    return "Amount can't be negative";
  }

  return '';
}
