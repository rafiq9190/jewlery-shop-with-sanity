import Link from 'next/link'

import PostCard from '@/app/components/journal/PostCard'
import ProductGrid from '@/app/components/shop/ProductGrid'
import {buttonStyles} from '@/app/components/ui/button'
import JewelImage from '@/app/components/ui/JewelImage'
import Reveal from '@/app/components/ui/Reveal'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {sanityFetch} from '@/sanity/lib/live'
import {
  categoriesQuery,
  featuredProductsQuery,
  morePostsQuery,
  settingsQuery,
} from '@/sanity/lib/queries'
import {dataAttr} from '@/sanity/lib/utils'

const PROMISES = [
  {
    title: 'Recycled gold',
    text: 'Every piece is cast in 100% recycled 14k and 18k gold or platinum.',
    icon: 'M12 3l2.6 5.6L20 9.3l-4 4 1 5.7-5-2.8-5 2.8 1-5.7-4-4 5.4-.7L12 3z',
  },
  {
    title: 'Ethically sourced',
    text: 'Conflict-free diamonds and gemstones, traced from mine to atelier.',
    icon: 'M6 9l3-5h6l3 5-6 11L6 9zM6 9h12M9 4l3 5 3-5M12 9v11',
  },
  {
    title: 'Lifetime care',
    text: 'Complimentary cleaning, polishing and resizing for as long as you own it.',
    icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  },
]

export default async function Page() {
  const [{data: settings}, {data: categories}, {data: featured}, {data: posts}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: categoriesQuery}),
    sanityFetch({query: featuredProductsQuery}),
    sanityFetch({query: morePostsQuery, params: {skip: '', limit: 3}}),
  ])

  const hero = settings?.hero
  const collection = settings?.featuredCollection

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid lg:min-h-[calc(100svh-7rem)] lg:max-h-[56rem] lg:grid-cols-[1fr_1.1fr]">
          <div className="relative z-10 flex flex-col justify-center gap-8 px-5 py-20 md:px-16 lg:py-24">
            <span className="eyebrow animate-fade-up text-gold">
              {hero?.eyebrow || 'Fine jewelry, made by hand'}
            </span>
            <h1
              className="animate-fade-up text-6xl leading-[0.95] [animation-delay:120ms] sm:text-7xl xl:text-8xl"
              data-sanity={
                settings?._id
                  ? dataAttr({id: settings._id, type: 'settings', path: 'hero.heading'}).toString()
                  : undefined
              }
            >
              {hero?.heading || 'Timeless'}
              <br />
              <em className="font-light text-gold">{hero?.headingAccent || 'brilliance'}</em>
            </h1>
            <p className="max-w-md animate-fade-up text-lg leading-relaxed text-stone [animation-delay:240ms]">
              {hero?.subheading ||
                'Heirloom-quality pieces in recycled gold and ethically sourced stones, designed to be worn every day and treasured for generations.'}
            </p>
            <div className="flex animate-fade-up flex-wrap gap-4 [animation-delay:360ms]">
              <Link href="/shop" className={buttonStyles.solid}>
                {hero?.ctaLabel || 'Shop the collection'}
              </Link>
              {collection?.slug && (
                <Link href={`/collections/${collection.slug}`} className={buttonStyles.outline}>
                  {collection.title}
                </Link>
              )}
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-cream sm:aspect-[4/3] lg:aspect-auto">
            <JewelImage
              image={hero?.image}
              width={1400}
              height={1600}
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority
              className="animate-slow-zoom"
            />
            <div className="pointer-events-none absolute inset-6 border border-ivory/50 md:inset-10" aria-hidden />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-24 md:py-32">
          <Reveal>
            <SectionHeading eyebrow="Explore" title="Shop by category" />
          </Reveal>
          <ul className="mt-16 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {categories.map((category, i) => (
              <Reveal as="li" key={category._id} delay={i * 90}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-cream"
                >
                  <JewelImage
                    image={category.image}
                    width={600}
                    height={800}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-6 text-ivory">
                    <span className="font-serif text-3xl">{category.title}</span>
                    <span className="eyebrow text-[0.6rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      Discover
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      {/* Bestsellers */}
      {featured.length > 0 && (
        <section className="bg-cream/60 py-24 md:py-32">
          <div className="container">
            <Reveal>
              <SectionHeading eyebrow="Most loved" title="Signature pieces" />
            </Reveal>
            <div className="mt-16">
              <ProductGrid products={featured} />
            </div>
            <div className="mt-16 flex justify-center">
              <Link href="/shop" className={buttonStyles.link}>
                View all jewelry
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured collection */}
      {collection?.slug && (
        <section className="relative overflow-hidden bg-ink text-ivory">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[50vh] lg:min-h-[80vh]">
              <JewelImage image={collection.heroImage} width={1400} sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <Reveal className="flex flex-col justify-center gap-8 px-5 py-20 md:px-16">
              <span className="eyebrow text-champagne">The collection</span>
              <h2 className="text-5xl leading-none text-ivory md:text-7xl">{collection.title}</h2>
              {collection.tagline && (
                <p className="font-serif text-2xl italic text-champagne">{collection.tagline}</p>
              )}
              {collection.description && (
                <p className="max-w-md leading-relaxed text-ivory/70">{collection.description}</p>
              )}
              <div>
                <Link href={`/collections/${collection.slug}`} className={buttonStyles.light}>
                  Explore the collection
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Brand promises */}
      <section className="container py-24 md:py-32">
        <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
          {PROMISES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 120} className="flex flex-col items-center gap-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-champagne text-gold">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
                  <path d={p.icon} strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="text-2xl">{p.title}</h3>
              <p className="max-w-xs leading-relaxed text-stone">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Journal */}
      {posts.length > 0 && (
        <section className="border-t border-sand py-24 md:py-32">
          <div className="container">
            <Reveal>
              <SectionHeading eyebrow="The Journal" title="Stories of craft & style" />
            </Reveal>
            <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
              {posts.map((post, i) => (
                <Reveal as="li" key={post._id} delay={i * 120}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>
            <div className="mt-16 flex justify-center">
              <Link href="/journal" className={buttonStyles.link}>
                Visit the journal
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
