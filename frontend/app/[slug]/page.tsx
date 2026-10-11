import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: PageProps<'/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata
}

export default async function Page(props: PageProps<'/[slug]'>) {
  const params = await props.params
  const [{data: page}] = await Promise.all([sanityFetch({query: getPageQuery, params})])

  if (!page?._id) {
    notFound()
  }

  return (
    <div className="pb-16 md:pb-24">
      <header className="container flex flex-col items-center gap-6 py-16 text-center md:py-24">
        <h1 className="max-w-4xl text-6xl leading-none md:text-8xl">{page.heading}</h1>
        {page.subheading && (
          <p className="max-w-2xl font-serif text-2xl italic leading-relaxed text-stone">{page.subheading}</p>
        )}
        <span className="hairline w-24" aria-hidden />
      </header>
      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  )
}
