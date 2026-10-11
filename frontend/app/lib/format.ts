const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatPrice(amount: number | null | undefined) {
  return amount == null ? '' : currency.format(amount)
}

export const METAL_LABELS: Record<string, string> = {
  'yellow-gold': 'Yellow gold',
  'white-gold': 'White gold',
  'rose-gold': 'Rose gold',
  silver: 'Sterling silver',
  platinum: 'Platinum',
}
