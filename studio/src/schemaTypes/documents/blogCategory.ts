import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Journal (blog) category, e.g. Style Guides, Gemstone Stories, Care.
 */

export const blogCategory = defineType({
  name: 'blogCategory',
  title: 'Journal category',
  icon: BookIcon,
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
  ],
})
