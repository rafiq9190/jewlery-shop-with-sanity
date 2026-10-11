'use server'

import {createHash} from 'node:crypto'

import {writeClient} from '@/sanity/lib/writeClient'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type NewsletterState = {status: 'idle' | 'success' | 'error'; message?: string}

export async function subscribe(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) {
    return {status: 'error', message: 'Please enter a valid email address.'}
  }

  // Deterministic ID so signing up twice is harmless
  const id = `subscriber-${createHash('sha256').update(email).digest('hex').slice(0, 32)}`
  try {
    await writeClient.createIfNotExists({
      _id: id,
      _type: 'subscriber',
      email,
      source: 'website',
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Newsletter sign-up failed', error)
    return {status: 'error', message: 'Something went wrong. Please try again.'}
  }
  return {status: 'success'}
}
