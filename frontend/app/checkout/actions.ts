'use server'

import {headers} from 'next/headers'
import {redirect} from 'next/navigation'

import {getStripe} from '@/app/lib/stripe'
import {client} from '@/sanity/lib/client'
import {checkoutProductsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'

type CheckoutLine = {productId: string; variantKey: string | null; quantity: number}

/**
 * Creates a Stripe Checkout Session and redirects to it.
 * Prices and stock are always read from Sanity here; the browser only tells us what and how many.
 */
export async function createCheckoutSession(lines: CheckoutLine[]): Promise<{error: string}> {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Checkout is disabled: add STRIPE_SECRET_KEY to .env.local')
    return {error: 'Online checkout is not available yet. Please contact us to place your order.'}
  }
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) {
    return {error: 'Your bag is empty.'}
  }
  if (lines.some((l) => !Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 10)) {
    return {error: 'Please check the quantities in your bag.'}
  }

  const products = await client
    .withConfig({useCdn: false, stega: false})
    .fetch(checkoutProductsQuery, {ids: [...new Set(lines.map((l) => l.productId))]})

  const lineItems = []
  for (const line of lines) {
    const product = products.find((p) => p._id === line.productId)
    if (!product) {
      return {error: 'An item in your bag is no longer available. Please remove it and try again.'}
    }
    const variant = line.variantKey ? product.variants?.find((v) => v._key === line.variantKey) : null
    if (line.variantKey && !variant) {
      return {error: `The selected option for ${product.name} is no longer available.`}
    }
    const stock = variant ? variant.stock : (product.stock ?? 0)
    if (stock < line.quantity) {
      return {
        error:
          stock > 0
            ? `Only ${stock} of ${product.name} left. Please update your bag.`
            : `${product.name}${variant ? ` (${variant.label})` : ''} is sold out.`,
      }
    }
    const price = variant?.price ?? product.price
    const image = product.image?.asset?._ref
      ? urlForImage(product.image).width(600).height(600).fit('crop').url()
      : undefined

    lineItems.push({
      quantity: line.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(price * 100),
        product_data: {
          name: product.name,
          description: variant?.label,
          images: image ? [image] : undefined,
          // Read back by the webhook to record the order and decrement stock
          metadata: {productId: product._id, variantKey: variant?._key ?? '', variantLabel: variant?.label ?? ''},
        },
      },
    })
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || (await headers()).get('origin') || 'http://localhost:3000'

  let url: string | null
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {allowed_countries: ['US', 'CA', 'GB', 'AU', 'AE', 'PK']},
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })
    url = session.url
  } catch (error) {
    console.error('Stripe checkout error', error)
    return {error: 'We could not start checkout. Please try again in a moment.'}
  }

  if (!url) return {error: 'We could not start checkout. Please try again in a moment.'}
  redirect(url)
}
