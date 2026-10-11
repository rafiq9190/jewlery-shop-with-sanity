import {defineField, defineType} from 'sanity'

/**
 * Reusable image with required alt text, used for product, category and collection imagery.
 */

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    aiAssist: {
      imageDescriptionField: 'alt',
    },
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Important for SEO and accessibility.',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as {asset?: {_ref?: string}} | undefined
          if (parent?.asset?._ref && !alt) {
            return 'Required'
          }
          return true
        }),
    }),
  ],
})
