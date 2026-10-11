import {BasketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Orders are created by the Stripe webhook after a successful checkout and are read-only in the Studio.
 */

export const order = defineType({
  name: 'order',
  title: 'Order',
  icon: BasketIcon,
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'stripeSessionId', title: 'Stripe session', type: 'string'}),
    defineField({name: 'email', title: 'Customer email', type: 'string'}),
    defineField({name: 'customerName', title: 'Customer name', type: 'string'}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['paid', 'fulfilled', 'refunded']},
    }),
    defineField({name: 'total', title: 'Total (USD)', type: 'number'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'orderItem',
          fields: [
            defineField({name: 'product', type: 'reference', to: [{type: 'product'}], weak: true}),
            defineField({name: 'name', type: 'string'}),
            defineField({name: 'variant', type: 'string'}),
            defineField({name: 'quantity', type: 'number'}),
            defineField({name: 'unitPrice', type: 'number'}),
          ],
          preview: {
            select: {title: 'name', variant: 'variant', quantity: 'quantity'},
            prepare({title, variant, quantity}) {
              return {title: `${quantity} × ${title}`, subtitle: variant}
            },
          },
        }),
      ],
    }),
    defineField({name: 'shippingAddress', title: 'Shipping address', type: 'text', rows: 4}),
    defineField({name: 'createdAt', title: 'Created', type: 'datetime'}),
  ],
  orderings: [{title: 'Newest', name: 'createdDesc', by: [{field: 'createdAt', direction: 'desc'}]}],
  preview: {
    select: {email: 'email', total: 'total', status: 'status', createdAt: 'createdAt'},
    prepare({email, total, status, createdAt}) {
      return {
        title: email || 'Unknown customer',
        subtitle: [total != null && `$${total}`, status, createdAt?.slice(0, 10)]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
