'use client'

import {useActionState} from 'react'

import {subscribe, type NewsletterState} from '@/app/lib/newsletter'

export default function Newsletter({tone = 'dark'}: {tone?: 'dark' | 'light'}) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribe, {status: 'idle'})
  const dark = tone === 'dark'

  if (state.status === 'success') {
    return (
      <p role="status" className="font-serif text-xl italic text-champagne">
        Thank you — welcome to the house.
      </p>
    )
  }

  return (
    <form action={action}>
      <div className={`flex border-b ${dark ? 'border-ivory/30' : 'border-ink/30'}`}>
        <label htmlFor={`newsletter-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${tone}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={state.status === 'error'}
          aria-describedby={state.status === 'error' ? `newsletter-${tone}-error` : undefined}
          className={`flex-1 bg-transparent py-3 outline-none ${dark ? 'placeholder:text-ivory/40' : 'placeholder:text-stone/60'}`}
        />
        <button
          type="submit"
          disabled={pending}
          className="eyebrow px-2 text-champagne transition-colors hover:text-ivory disabled:opacity-50"
        >
          {pending ? 'Joining…' : 'Subscribe'}
        </button>
      </div>
      {state.status === 'error' && (
        <p id={`newsletter-${tone}-error`} role="alert" className="mt-2 text-sm text-champagne">
          {state.message}
        </p>
      )}
    </form>
  )
}
