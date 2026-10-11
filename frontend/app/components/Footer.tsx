import Link from 'next/link'

import Newsletter from '@/app/components/Newsletter'
import {sanityFetch} from '@/sanity/lib/live'
import {categoriesQuery, settingsQuery} from '@/sanity/lib/queries'

export default async function Footer() {
  const [{data: settings}, {data: categories}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: categoriesQuery}),
  ])
  const title = settings?.title || 'Aurelia'

  return (
    <footer className="bg-ink text-ivory/80">
      <div className="container grid gap-16 py-20 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="max-w-sm space-y-6">
          <p className="font-serif text-4xl uppercase tracking-[0.18em] text-ivory">{title}</p>
          <p className="leading-relaxed">
            Join our list for first access to new collections, private events and the stories behind each piece.
          </p>
          <Newsletter />
        </div>
        <FooterColumn
          title="Shop"
          links={[
            {href: '/shop', label: 'All jewelry'},
            ...categories.map((c) => ({href: `/shop?category=${c.slug}`, label: c.title})),
          ]}
        />
        <FooterColumn
          title="House"
          links={[
            {href: '/about', label: 'Our story'},
            {href: '/journal', label: 'Journal'},
            {href: '/care', label: 'Jewelry care'},
          ]}
        />
        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <FooterColumn
            title="Follow"
            links={settings.socialLinks
              .filter((s) => s.url && s.platform)
              .map((s) => ({href: s.url!, label: s.platform!, external: true}))}
          />
        )}
      </div>
      <div className="border-t border-ivory/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-ivory/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {title}. All rights reserved.
          </p>
          <p className="eyebrow text-[0.6rem]">Recycled gold · Ethically sourced stones · Lifetime care</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: {href: string; label: string; external?: boolean}[]
}) {
  return (
    <div>
      <p className="eyebrow mb-6 text-champagne">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="hover:text-champagne transition-colors"
              {...(l.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
