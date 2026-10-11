import {DiamondIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page builder block that shows a hand-picked row of products.
 */

export const featuredProducts = defineType({
  name: 'featuredProducts',
  title: 'Featured products',
  icon: DiamondIcon,
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (rule) => rule.min(1).max(8),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Featured products', subtitle: 'Featured products'}
    },
  },
})
