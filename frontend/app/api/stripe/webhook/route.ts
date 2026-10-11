import type Stripe from 'stripe'

import {getStripe} from '@/app/lib/stripe'
import {writeClient} from '@/sanity/lib/writeClient'

/**
 * Stripe webhook: on a completed checkout, record an order in Sanity and decrement stock.
 * Local testing: stripe listen --forward-to localhost:3000/api/stripe/webhook
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  if (!secret || !signature) {
    return new Response('Webhook not configured', {status: 400})
  }

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
  } catch {
    return new Response('Invalid signature', {status: 400})
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({received: true})
  }

  const session = event.data.object
  const orderId = `order-${session.id}`

  // Stripe can deliver the same event more than once
  if (await writeClient.getDocument(orderId)) {
    return Response.json({received: true, duplicate: true})
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  })

  const items = lineItems.data.map((item) => {
    const product = item.price?.product as Stripe.Product
    return {
      _type: 'orderItem',
      _key: item.id.slice(-12),
      productId: product.metadata.productId,
      variantKey: product.metadata.variantKey || null,
      name: product.name,
      variant: product.metadata.variantLabel || undefined,
      quantity: item.quantity ?? 1,
      unitPrice: (item.price?.unit_amount ?? 0) / 100,
    }
  })

  const shipping = session.collected_information?.shipping_details
  const address = shipping
    ? [
        shipping.name,
        shipping.address.line1,
        shipping.address.line2,
        [shipping.address.city, shipping.address.state, shipping.address.postal_code]
          .filter(Boolean)
          .join(' '),
        shipping.address.country,
      ]
        .filter(Boolean)
        .join('\n')
    : undefined

  const tx = writeClient.transaction().create({
    _id: orderId,
    _type: 'order',
    stripeSessionId: session.id,
    email: session.customer_details?.email ?? undefined,
    customerName: session.customer_details?.name ?? undefined,
    status: 'paid',
    total: (session.amount_total ?? 0) / 100,
    items: items.map((item) => ({
      _type: item._type,
      _key: item._key,
      name: item.name,
      variant: item.variant,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      product: item.productId ? {_type: 'reference', _ref: item.productId, _weak: true} : undefined,
    })),
    shippingAddress: address,
    createdAt: new Date(event.created * 1000).toISOString(),
  })

  for (const item of items) {
    if (!item.productId) continue
    const path = item.variantKey ? `variants[_key=="${item.variantKey}"].stock` : 'stock'
    tx.patch(item.productId, (patch) => patch.dec({[path]: item.quantity}))
  }

  try {
    await tx.commit()
  } catch (error) {
    console.error('Failed to record order', error)
    return new Response('Failed to record order', {status: 500})
  }

  return Response.json({received: true})
}
