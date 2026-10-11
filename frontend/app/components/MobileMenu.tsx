'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

type NavLink = {href: string; label: string}

export default function MobileMenu({
  shopLinks,
  collectionLinks,
}: {
  shopLinks: NavLink[]
  collectionLinks: NavLink[]
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPathname, setLastPathname] = useState(pathname)

  // Close when navigating (adjusting state during render, per https://react.dev/learn/you-might-not-need-an-effect)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-m-2 p-2"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
        </svg>
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full h-[calc(100dvh-5rem)] overflow-y-auto border-t border-sand bg-ivory px-6 py-10"
      >
        <nav aria-label="Mobile" className="space-y-10">
          <MenuSection title="Shop" links={shopLinks} />
          {collectionLinks.length > 0 && <MenuSection title="Collections" links={collectionLinks} />}
          <MenuSection
            title="Discover"
            links={[
              {href: '/journal', label: 'Journal'},
              {href: '/about', label: 'Our story'},
            ]}
          />
        </nav>
      </div>
    </div>
  )
}

function MenuSection({title, links}: {title: string; links: NavLink[]}) {
  return (
    <div>
      <p className="eyebrow mb-4 text-gold">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-serif text-3xl">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
