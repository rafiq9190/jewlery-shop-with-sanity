import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import AddToBag from '@/app/components/shop/AddToBag'
import ProductGallery from '@/app/components/shop/ProductGallery'
import ProductGrid from '@/app/components/shop/ProductGrid'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {METAL_LABELS} from '@/app/lib/format'
import {sanityFetch} from '@/sanity/lib/live'
import {productQuery, productSlugs, relatedProductsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: productSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: PageProps<'/shop/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: product} = await sanityFetch({query: productQuery, params, stega: false})
  const ogImage = resolveOpenGraphImage(product?.image)
  return {
    title: product?.name,
    description: product?.shortDescription ?? undefined,
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

export default async function ProductPage(props: PageProps<'/shop/[slug]'>) {
  const params = await props.params
  const {data: product} = await sanityFetch({query: productQuery, params})

  if (!product?._id) {
    notFound()
  }

  const {data: related} = await sanityFetch({
    query: relatedProductsQuery,
    params: {categoryId: product.categoryRef?._id ?? '', skip: product._id},
  })

  const specs = [
    product.metal && {label: 'Metal', value: METAL_LABELS[product.metal]},
    product.gemstones?.length && {label: 'Stones', value: product.gemstones.join(', ')},
  ].filter(Boolean) as {label: string; value: string}[]

  return (
    <>
      <div className="container py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="eyebrow mb-8 flex gap-3 text-[0.6rem] text-mist">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span aria-hidden>/</span>
          {product.categoryRef && (
            <>
              <Link href={`/shop?category=${product.categoryRef.slug}`} className="hover:text-ink">
                {product.categoryRef.title}
              </Link>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="text-stone" aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <ProductGallery images={product.images ?? []} name={product.name} />

          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="space-y-4">
              <span className="eyebrow text-gold">{product.category}</span>
              <h1 className="text-5xl leading-none md:text-6xl">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-lg leading-relaxed text-stone">{product.shortDescription}</p>
              )}
            </div>

            <div className="mt-8">
              <AddToBag
                product={{
                  _id: product._id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  stock: product.stock,
                  imageRef: product.image?.asset?._ref ?? null,
                  variants: product.variants,
                }}
              />
            </div>

            {specs.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-sand pt-6">
                {specs.map((s) => (
                  <div key={s.label}>
                    <dt className="eyebrow text-[0.6rem] text-mist">{s.label}</dt>
                    <dd className="mt-1 font-serif text-lg">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 divide-y divide-sand border-y border-sand">
              {product.description && product.description.length > 0 && (
                <Accordion title="Description" open>
                  <PortableText value={product.description as PortableTextBlock[]} />
                </Accordion>
              )}
              {product.details && (
                <Accordion title="Details & dimensions">
                  <p className="whitespace-pre-line">{product.details}</p>
                </Accordion>
              )}
              {product.care && (
                <Accordion title="Care">
                  <p className="whitespace-pre-line">{product.care}</p>
                </Accordion>
              )}
              <Accordion title="Shipping & returns">
                <p>
                  Complimentary insured shipping on orders over $200. Returns and exchanges are welcome within 30
                  days in original condition.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-sand bg-cream/50 py-24">
          <div className="container">
            <SectionHeading eyebrow="Complete the look" title="You may also like" />
            <div className="mt-16">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Accordion({title, open, children}: {title: string; open?: boolean; children: React.ReactNode}) {
  return (
    <details className="group py-5" open={open}>
      <summary className="eyebrow flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-lg font-light text-gold transition-transform duration-300 group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <div className="pt-4 leading-relaxed text-stone">{children}</div>
    </details>
  )
}
