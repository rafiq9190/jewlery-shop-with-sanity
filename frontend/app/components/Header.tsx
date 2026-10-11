import Link from 'next/link'

import BagButton from '@/app/components/cart/BagButton'
import MobileMenu from '@/app/components/MobileMenu'
import {sanityFetch} from '@/sanity/lib/live'
import {categoriesQuery, collectionsQuery, settingsQuery} from '@/sanity/lib/queries'

export default async function Header() {
  const [{data: settings}, {data: categories}, {data: collections}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: categoriesQuery}),
    sanityFetch({query: collectionsQuery}),
  ])
  const title = settings?.title || 'Aurelia'

  const shopLinks = [
    {href: '/shop', label: 'All jewelry'},
    ...categories.map((c) => ({href: `/shop?category=${c.slug}`, label: c.title})),
  ]
  const collectionLinks = collections.map((c) => ({href: `/collections/${c.slug}`, label: c.title}))

  return (
    <header className="sticky top-0 z-50">
      {settings?.announcement && (
        <div className="bg-ink py-2.5 text-center">
          <p className="eyebrow text-[0.6rem] text-champagne">{settings.announcement}</p>
        </div>
      )}
      <div className="border-b border-sand/70 bg-ivory/85 backdrop-blur-md">
        <div className="container grid h-20 grid-cols-[1fr_auto_1fr] items-center">
          <nav aria-label="Main" className="flex items-center">
            <MobileMenu shopLinks={shopLinks} collectionLinks={collectionLinks} />
            <ul className="hidden items-center gap-8 lg:flex">
              <li className="group relative">
                <Link href="/shop" className="eyebrow py-8 hover:text-gold-deep transition-colors">
                  Shop
                </Link>
                <div className="invisible absolute left-0 top-full pt-6 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="grid w-[30rem] grid-cols-2 gap-8 border border-sand bg-ivory p-8 shadow-soft">
                    <DropdownColumn title="Categories" links={shopLinks} />
                    {collectionLinks.length > 0 && (
                      <DropdownColumn title="Collections" links={collectionLinks} />
                    )}
                  </div>
                </div>
              </li>
              {collectionLinks[0] && (
                <li>
                  <Link href={collectionLinks[0].href} className="eyebrow hover:text-gold-deep transition-colors">
                    {collectionLinks[0].label.replace(/^The /, '')}
                  </Link>
                </li>
              )}
              <li>
                <Link href="/journal" className="eyebrow hover:text-gold-deep transition-colors">
                  Journal
                </Link>
              </li>
            </ul>
          </nav>

          <Link href="/" className="text-center font-serif text-3xl tracking-[0.18em] uppercase md:text-4xl">
            {title}
          </Link>

          <div className="flex items-center justify-end gap-8">
            <Link href="/about" className="eyebrow hidden hover:text-gold-deep transition-colors lg:inline">
              Our story
            </Link>
            <BagButton />
          </div>
        </div>
      </div>
    </header>
  )
}

function DropdownColumn({title, links}: {title: string; links: {href: string; label: string}[]}) {
  return (
    <div>
      <p className="eyebrow mb-4 text-gold">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-serif text-xl hover:text-gold-deep transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
