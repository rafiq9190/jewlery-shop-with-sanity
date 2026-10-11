'use client'

import {useCart} from '@/app/components/cart/CartProvider'

export default function BagButton() {
  const {count, open} = useCart()
  return (
    <button
      type="button"
      onClick={open}
      className="relative flex items-center gap-2 p-2 -m-2 hover:text-gold-deep transition-colors"
      aria-label={`Open shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
      <span className="eyebrow hidden md:inline">Bag</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-2 md:static flex h-5 min-w-5 items-center justify-center rounded-full bg-gold text-[0.65rem] text-ivory px-1">
          {count}
        </span>
      )}
    </button>
  )
}
