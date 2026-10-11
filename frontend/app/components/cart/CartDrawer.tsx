'use client'

import Link from 'next/link'
import {useEffect, useTransition} from 'react'
import {toast} from 'sonner'

import {createCheckoutSession} from '@/app/checkout/actions'
import {useCart} from '@/app/components/cart/CartProvider'
import {buttonStyles} from '@/app/components/ui/button'
import JewelImage from '@/app/components/ui/JewelImage'
import {formatPrice} from '@/app/lib/format'

export default function CartDrawer() {
  const {lines, subtotal, isOpen, close, setQuantity} = useCart()
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  const checkout = () =>
    startTransition(async () => {
      const result = await createCheckoutSession(
        lines.map(({productId, variantKey, quantity}) => ({productId, variantKey, quantity})),
      )
      // On success the action redirects to Stripe, so we only get here on error
      if (result?.error) toast.error(result.error)
    })

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/30 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        inert={!isOpen}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-sand px-6 py-5">
          <h2 className="text-2xl">Your bag</h2>
          <button type="button" onClick={close} className="eyebrow text-stone hover:text-ink">
            Close
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="font-serif text-2xl italic text-stone">Your bag is empty</p>
            <Link href="/shop" onClick={close} className={buttonStyles.outline}>
              Discover the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-sand overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={`${line.productId}:${line.variantKey}`} className="flex gap-4 py-5">
                  <Link
                    href={`/shop/${line.slug}`}
                    onClick={close}
                    className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-cream"
                  >
                    <JewelImage image={line.imageRef ? {asset: {_ref: line.imageRef}} : null} width={160} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-serif text-lg leading-tight">{line.name}</p>
                        {line.variantLabel && <p className="text-sm text-stone">{line.variantLabel}</p>}
                      </div>
                      <p className="text-sm">{formatPrice(line.price * line.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-sand">
                        <button
                          type="button"
                          className="px-3 py-1 hover:text-gold-deep"
                          onClick={() => setQuantity(line.productId, line.variantKey, line.quantity - 1)}
                          aria-label={`Decrease quantity of ${line.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1 hover:text-gold-deep"
                          onClick={() => setQuantity(line.productId, line.variantKey, line.quantity + 1)}
                          aria-label={`Increase quantity of ${line.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-stone underline underline-offset-4 hover:text-ink"
                        onClick={() => setQuantity(line.productId, line.variantKey, 0)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="space-y-4 border-t border-sand px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-stone">Subtotal</span>
                <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-stone">Shipping and taxes calculated at checkout.</p>
              <button
                type="button"
                onClick={checkout}
                disabled={pending}
                className={`${buttonStyles.solid} w-full`}
              >
                {pending ? 'Preparing secure checkout…' : 'Checkout'}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
