import {formatPrice} from '@/app/lib/format'

export default function Price({
  price,
  compareAtPrice,
  className = '',
}: {
  price: number | null | undefined
  compareAtPrice?: number | null
  className?: string
}) {
  const onSale = compareAtPrice != null && price != null && compareAtPrice > price
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={onSale ? 'text-gold-deep' : ''}>{formatPrice(price)}</span>
      {onSale && (
        <span className="text-mist line-through decoration-1 text-[0.85em]">
          <span className="sr-only">Was </span>
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </span>
  )
}
