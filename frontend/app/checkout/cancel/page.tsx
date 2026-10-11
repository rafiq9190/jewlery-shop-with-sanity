import type {Metadata} from 'next'
import Link from 'next/link'

import {buttonStyles} from '@/app/components/ui/button'

export const metadata: Metadata = {
  title: 'Checkout cancelled',
  robots: {index: false},
}

export default function CheckoutCancelPage() {
  return (
    <div className="container flex flex-col items-center gap-8 py-32 text-center">
      <span className="eyebrow text-gold">Checkout paused</span>
      <h1 className="text-5xl md:text-6xl">Your bag is waiting</h1>
      <p className="max-w-md text-lg leading-relaxed text-stone">
        No payment was taken. Your pieces are still in your bag whenever you are ready.
      </p>
      <Link href="/shop" className={buttonStyles.outline}>
        Return to the shop
      </Link>
    </div>
  )
}
