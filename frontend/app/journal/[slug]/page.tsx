import type {Metadata, ResolvingMetadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import PostCard from '@/app/components/journal/PostCard'
import PortableText from '@/app/components/PortableText'
import ProductGrid from '@/app/components/shop/ProductGrid'
import JewelImage from '@/app/components/ui/JewelImage'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  props: PageProps<'/journal/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: PageProps<'/journal/[slug]'>) {
  const params = await props.params
  const {data: post} = await sanityFetch({query: postQuery, params})

  if (!post?._id) {
    notFound()
  }
  const relatedProducts = (post.relatedProducts ?? []).filter((p) => p?.slug)

  return (
    <>
      <article>
        <header className="container flex flex-col items-center gap-6 pb-12 pt-16 text-center md:pt-24">
          <Link href="/journal" className="eyebrow text-gold hover:text-gold-deep">
            {post.categories?.[0]?.title ?? 'The Journal'}
          </Link>
          <h1 className="max-w-4xl text-5xl leading-[1.05] md:text-7xl">{post.title}</h1>
          {post.excerpt && (
            <p className="max-w-2xl font-serif text-2xl italic leading-relaxed text-stone">{post.excerpt}</p>
          )}
          {post.author && post.author.firstName && post.author.lastName && (
            <div className="text-sm text-stone">
              <Avatar person={post.author} date={post.date} />
            </div>
          )}
        </header>

        {post.coverImage?.asset?._ref && (
          <div className="container">
            <div className="relative aspect-[16/9] overflow-hidden bg-cream">
              <JewelImage image={post.coverImage} width={1800} sizes="100vw" priority />
            </div>
          </div>
        )}

        {post.content?.length && (
          <div className="container py-16 md:py-24">
            <PortableText
              className="mx-auto max-w-2xl first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-gold"
              value={post.content as PortableTextBlock[]}
            />
          </div>
        )}
      </article>

      {relatedProducts.length > 0 && (
        <section className="border-t border-sand bg-cream/60 py-24">
          <div className="container">
            <SectionHeading eyebrow="As featured" title="Shop the story" />
            <div className="mt-16">
              <ProductGrid products={relatedProducts} />
            </div>
          </div>
        </section>
      )}

      <Suspense>
        <MoreStories skip={post._id} />
      </Suspense>
    </>
  )
}

async function MoreStories({skip}: {skip: string}) {
  const {data} = await sanityFetch({query: morePostsQuery, params: {skip, limit: 3}})
  if (!data?.length) return null

  return (
    <section className="border-t border-sand py-24">
      <div className="container">
        <SectionHeading eyebrow="Keep reading" title="More from the Journal" />
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {data.map((post) => (
            <li key={post._id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
