import type {Metadata} from 'next'
import Link from 'next/link'

import PostCard from '@/app/components/journal/PostCard'
import Reveal from '@/app/components/ui/Reveal'
import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery, blogCategoriesQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Style guides, gemstone stories and the craft behind our jewelry.',
}

export default async function JournalPage(props: PageProps<'/journal'>) {
  const searchParams = await props.searchParams
  const category = typeof searchParams.category === 'string' ? searchParams.category : null

  const [{data: posts}, {data: categories}] = await Promise.all([
    sanityFetch({query: allPostsQuery, params: {category}}),
    sanityFetch({query: blogCategoriesQuery}),
  ])
  const [lead, ...rest] = posts

  return (
    <div className="container py-16 md:py-24">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="eyebrow text-gold">Stories of craft & style</span>
        <h1 className="text-6xl md:text-8xl">
          The <em className="font-light text-gold">Journal</em>
        </h1>
        <span className="hairline w-24" aria-hidden />
      </header>

      {categories.length > 0 && (
        <nav aria-label="Journal categories" className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <CategoryLink href="/journal" active={!category}>
            All stories
          </CategoryLink>
          {categories.map((c) => (
            <CategoryLink key={c._id} href={`/journal?category=${c.slug}`} active={category === c.slug}>
              {c.title}
            </CategoryLink>
          ))}
        </nav>
      )}

      {!lead ? (
        <p className="py-24 text-center font-serif text-3xl italic text-stone">
          New stories are being written. Check back soon.
        </p>
      ) : (
        <>
          <Reveal className="mt-16">
            <PostCard post={lead} large />
          </Reveal>
          {rest.length > 0 && (
            <ul className="mt-20 grid gap-x-8 gap-y-16 border-t border-sand pt-20 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Reveal as="li" key={post._id} delay={(i % 3) * 100}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

function CategoryLink({href, active, children}: {href: string; active: boolean; children: React.ReactNode}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={`eyebrow transition-colors ${active ? 'text-ink underline decoration-champagne underline-offset-8' : 'text-mist hover:text-ink'}`}
    >
      {children}
    </Link>
  )
}
