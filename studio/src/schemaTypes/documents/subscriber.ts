import {EnvelopeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Newsletter sign-ups, created by the website form. Export them to your email provider.
 */

export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  icon: EnvelopeIcon,
  type: 'document',
  readOnly: true,
  fields: [
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'source', title: 'Signed up from', type: 'string'}),
    defineField({name: 'createdAt', title: 'Signed up', type: 'datetime'}),
  ],
  orderings: [{title: 'Newest', name: 'createdDesc', by: [{field: 'createdAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'email', createdAt: 'createdAt'},
    prepare: ({title, createdAt}) => ({title, subtitle: createdAt?.slice(0, 10)}),
  },
})
