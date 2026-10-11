import {defineField, defineType} from 'sanity'

/**
 * A purchasable option of a product, e.g. a ring size or chain length.
 */

export const productVariant = defineType({
  name: 'productVariant',
  title: 'Variant',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Shown to customers, e.g. "Size 6" or "18 inch chain"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Price override',
      type: 'number',
      description: 'Leave empty to use the product price',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.required().min(0).integer(),
    }),
  ],
  preview: {
    select: {title: 'label', stock: 'stock', price: 'price'},
    prepare({title, stock, price}) {
      return {
        title,
        subtitle: [price != null && `$${price}`, `${stock ?? 0} in stock`]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
