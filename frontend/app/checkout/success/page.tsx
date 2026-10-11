import type {Metadata} from 'next'
import Link from 'next/link'

import ClearCart from '@/app/checkout/success/ClearCart'
import {buttonStyles} from '@/app/components/ui/button'
import {getStripe} from '@/app/lib/stripe'

export const metadata: Metadata = {
  title: 'Thank you',
  robots: {index: false},
}

async function getCustomerEmail(sessionId: string | undefined) {
  if (!sessionId?.startsWith('cs_')) return null
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid' ? session.customer_details?.email : null
  } catch {
    return null
  }
}

export default async function CheckoutSuccessPage(props: PageProps<'/checkout/success'>) {
  const {session_id} = await props.searchParams
  const email = await getCustomerEmail(typeof session_id === 'string' ? session_id : undefined)

  return (
    <div className="container flex flex-col items-center gap-8 py-32 text-center">
      <ClearCart />
      <span className="flex h-20 w-20 items-center justify-center rounded-full border border-champagne text-gold">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <span className="eyebrow text-gold">Order confirmed</span>
      <h1 className="text-5xl md:text-7xl">
        Thank you, <em className="font-light text-gold">truly</em>
      </h1>
      <p className="max-w-lg text-lg leading-relaxed text-stone">
        Your piece is being prepared in our atelier.
        {email ? ` A confirmation has been sent to ${email}.` : ' A confirmation email is on its way.'}
      </p>
      <Link href="/shop" className={buttonStyles.outline}>
        Continue shopping
      </Link>
    </div>
  )
}
