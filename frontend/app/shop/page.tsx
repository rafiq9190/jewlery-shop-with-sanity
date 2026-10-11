import type {Metadata} from 'next'
import Link from 'next/link'

import ProductGrid from '@/app/components/shop/ProductGrid'
import {buttonStyles} from '@/app/components/ui/button'
import {METAL_LABELS} from '@/app/lib/format'
import {sanityFetch} from '@/sanity/lib/live'
import {categoriesQuery, productsQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Rings, necklaces, earrings and bracelets, handcrafted in recycled gold.',
}

const PRICE_BANDS = {
  'under-500': {label: 'Under $500', min: null, max: 499.99},
  '500-1000': {label: '$500 – $1,000', min: 500, max: 1000},
  'over-1000': {label: 'Over $1,000', min: 1000.01, max: null},
} as const

const SORTS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
} as const

type Filters = {category?: string; metal?: string; price?: string; sort?: string}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

function hrefWith(current: Filters, key: keyof Filters, value: string | undefined) {
  const next = new URLSearchParams()
  for (const [k, v] of Object.entries({...current, [key]: value})) {
    if (v) next.set(k, v)
  }
  const qs = next.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

export default async function ShopPage(props: PageProps<'/shop'>) {
  const searchParams = await props.searchParams
  const filters: Filters = {
    category: first(searchParams.category),
    metal: first(searchParams.metal),
    price: first(searchParams.price),
    sort: first(searchParams.sort),
  }
  const band = filters.price ? PRICE_BANDS[filters.price as keyof typeof PRICE_BANDS] : undefined

  const [{data: categories}, {data: products}] = await Promise.all([
    sanityFetch({query: categoriesQuery}),
    sanityFetch({
      query: productsQuery,
      params: {
        category: filters.category ?? null,
        metal: filters.metal ?? null,
        minPrice: band?.min ?? null,
        maxPrice: band?.max ?? null,
      },
    }),
  ])

  const sorted =
    filters.sort === 'price-asc'
      ? [...products].sort((a, b) => a.price - b.price)
      : filters.sort === 'price-desc'
        ? [...products].sort((a, b) => b.price - a.price)
        : products

  const activeCategory = categories.find((c) => c.slug === filters.category)
  const hasFilters = Boolean(filters.category || filters.metal || filters.price)

  return (
    <div className="container py-16 md:py-24">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="eyebrow text-gold">The collection</span>
        <h1 className="text-6xl md:text-7xl">{activeCategory?.title ?? 'All jewelry'}</h1>
        <span className="hairline w-24" aria-hidden />
      </header>

      <nav aria-label="Categories" className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
        <FilterLink href={hrefWith(filters, 'category', undefined)} active={!filters.category}>
          All
        </FilterLink>
        {categories.map((c) => (
          <FilterLink key={c._id} href={hrefWith(filters, 'category', c.slug)} active={filters.category === c.slug}>
            {c.title}
          </FilterLink>
        ))}
      </nav>

      <div className="mt-12 flex flex-col gap-6 border-y border-sand py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:gap-10">
          <FilterGroup label="Metal">
            {Object.entries(METAL_LABELS).map(([value, label]) => (
              <FilterChip
                key={value}
                href={hrefWith(filters, 'metal', filters.metal === value ? undefined : value)}
                active={filters.metal === value}
              >
                {label}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Price">
            {Object.entries(PRICE_BANDS).map(([value, {label}]) => (
              <FilterChip
                key={value}
                href={hrefWith(filters, 'price', filters.price === value ? undefined : value)}
                active={filters.price === value}
              >
                {label}
              </FilterChip>
            ))}
          </FilterGroup>
        </div>
        <FilterGroup label="Sort">
          {Object.entries(SORTS).map(([value, label]) => (
            <FilterChip
              key={value}
              href={hrefWith(filters, 'sort', value === 'featured' ? undefined : value)}
              active={(filters.sort ?? 'featured') === value}
            >
              {label}
            </FilterChip>
          ))}
        </FilterGroup>
      </div>

      <p className="mt-6 text-sm text-stone" aria-live="polite">
        {sorted.length} {sorted.length === 1 ? 'piece' : 'pieces'}
        {hasFilters && (
          <>
            {' · '}
            <Link href={filters.sort ? `/shop?sort=${filters.sort}` : '/shop'} className="underline underline-offset-4 hover:text-ink">
              Clear filters
            </Link>
          </>
        )}
      </p>

      <div className="mt-10">
        {sorted.length > 0 ? (
          <ProductGrid products={sorted} />
        ) : (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <p className="font-serif text-3xl italic text-stone">Nothing matches just yet</p>
            <Link href="/shop" className={buttonStyles.outline}>
              View all jewelry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterLink({href, active, children}: {href: string; active: boolean; children: React.ReactNode}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={`font-serif text-2xl transition-colors ${active ? 'text-ink italic' : 'text-mist hover:text-ink'}`}
    >
      {children}
    </Link>
  )
}

function FilterGroup({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-2 text-[0.6rem] text-mist">{label}</span>
      {children}
    </div>
  )
}

function FilterChip({href, active, children}: {href: string; active: boolean; children: React.ReactNode}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? 'border-ink bg-ink text-ivory' : 'border-sand text-stone hover:border-ink hover:text-ink'}`}
    >
      {children}
    </Link>
  )
}
