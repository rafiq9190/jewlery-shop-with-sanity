import {DiamondIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Product schema. A piece of jewelry that can be added to the bag and purchased.
 */

export const METALS = [
  {title: 'Yellow gold', value: 'yellow-gold'},
  {title: 'White gold', value: 'white-gold'},
  {title: 'Rose gold', value: 'rose-gold'},
  {title: 'Sterling silver', value: 'silver'},
  {title: 'Platinum', value: 'platinum'},
]

export const product = defineType({
  name: 'product',
  title: 'Product',
  icon: DiamondIcon,
  type: 'document',
  groups: [
    {name: 'main', title: 'Main', default: true},
    {name: 'inventory', title: 'Price & stock'},
    {name: 'details', title: 'Details'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      description: 'The first image is the main image; the second is shown on hover',
      type: 'array',
      group: 'main',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'main',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 2,
      group: 'main',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContentTextOnly',
      group: 'main',
    }),
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      group: 'inventory',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price',
      description: 'Original price, shown struck through when the item is on sale',
      type: 'number',
      group: 'inventory',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      description: 'Sizes or lengths. If empty, the product is sold as a single item using Stock below',
      type: 'array',
      group: 'inventory',
      of: [defineArrayMember({type: 'productVariant'})],
    }),
    defineField({
      name: 'stock',
      title: 'Stock',
      type: 'number',
      group: 'inventory',
      initialValue: 5,
      hidden: ({document}) => Array.isArray(document?.variants) && document.variants.length > 0,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'metal',
      title: 'Metal',
      type: 'string',
      group: 'details',
      options: {list: METALS},
    }),
    defineField({
      name: 'gemstones',
      title: 'Gemstones',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'details',
      title: 'Details & dimensions',
      type: 'text',
      rows: 4,
      group: 'details',
    }),
    defineField({
      name: 'care',
      title: 'Care instructions',
      type: 'text',
      rows: 3,
      group: 'details',
    }),
  ],
  preview: {
    select: {title: 'name', price: 'price', category: 'category.title', media: 'images.0'},
    prepare({title, price, category, media}) {
      return {
        title,
        media,
        subtitle: [category, price != null && `$${price}`].filter(Boolean).join(' · '),
      }
    },
  },
})
