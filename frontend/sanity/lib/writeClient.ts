import 'server-only'

import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

/**
 * Client with write access, used only by the Stripe webhook to record orders and decrement stock.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'raw',
  token: process.env.SANITY_API_WRITE_TOKEN,
})
