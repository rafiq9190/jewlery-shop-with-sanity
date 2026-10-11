import {SparklesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Curated collection of products with its own editorial landing page.
 */

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  icon: SparklesIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'products',
      title: 'Products',
      description: 'Drag to set the order products appear in on the collection page',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline', media: 'heroImage'},
  },
})
