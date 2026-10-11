import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import ProductGrid from '@/app/components/shop/ProductGrid'
import JewelImage from '@/app/components/ui/JewelImage'
import {sanityFetch} from '@/sanity/lib/live'
import {collectionQuery, collectionSlugs} from '@/sanity/lib/queries'
import {dataAttr, resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: collectionSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: PageProps<'/collections/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: collection} = await sanityFetch({query: collectionQuery, params, stega: false})
  const ogImage = resolveOpenGraphImage(collection?.heroImage)
  return {
    title: collection?.title,
    description: collection?.description ?? collection?.tagline ?? undefined,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function CollectionPage(props: PageProps<'/collections/[slug]'>) {
  const params = await props.params
  const {data: collection} = await sanityFetch({query: collectionQuery, params})

  if (!collection?._id) {
    notFound()
  }
  // References to deleted or unpublished products resolve to null
  const products = (collection.products ?? []).filter((p) => p?.slug)

  return (
    <>
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink">
        <JewelImage
          image={collection.heroImage}
          width={2000}
          sizes="100vw"
          priority
          className="animate-slow-zoom opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="container relative z-10 pb-16 pt-40 text-ivory md:pb-24">
          <span className="eyebrow text-champagne">The collection</span>
          <h1
            className="mt-4 animate-fade-up text-6xl leading-none text-ivory md:text-8xl"
            data-sanity={dataAttr({id: collection._id, type: 'collection', path: 'title'}).toString()}
          >
            {collection.title}
          </h1>
          {collection.tagline && (
            <p className="mt-6 max-w-xl animate-fade-up font-serif text-2xl italic text-champagne [animation-delay:150ms] md:text-3xl">
              {collection.tagline}
            </p>
          )}
        </div>
      </section>

      {collection.description && (
        <section className="container py-20 text-center md:py-28">
          <p className="mx-auto max-w-2xl font-serif text-2xl leading-relaxed text-stone md:text-3xl">
            {collection.description}
          </p>
          <span className="hairline mx-auto mt-10 block w-24" aria-hidden />
        </section>
      )}

      <section className="container pb-24 md:pb-32">
        {products.length > 0 ? (
          <ProductGrid products={products} columns={3} />
        ) : (
          <p className="py-20 text-center font-serif text-2xl italic text-stone">
            Pieces for this collection are coming soon.
          </p>
        )}
      </section>
    </>
  )
}
