import Link from 'next/link'

import {buttonStyles} from '@/app/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-8 py-32 text-center">
      <span className="eyebrow text-gold">Page not found</span>
      <h1 className="text-6xl md:text-8xl">
        Lost <em className="font-light text-gold">sparkle</em>
      </h1>
      <p className="max-w-md text-lg leading-relaxed text-stone">
        The page you are looking for has moved or no longer exists.
      </p>
      <Link href="/shop" className={buttonStyles.outline}>
        Explore the collection
      </Link>
    </div>
  )
}
