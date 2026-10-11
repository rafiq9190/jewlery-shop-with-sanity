import ProductGrid from '@/app/components/shop/ProductGrid'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {ExtractPageBuilderType} from '@/sanity/lib/types'

type Props = {
  block: ExtractPageBuilderType<'featuredProducts'>
  index: number
  pageId: string
  pageType: string
}

export default function FeaturedProductsBlock({block}: Props) {
  const products = (block.products ?? []).filter((p) => p?.slug)
  if (products.length === 0) return null

  return (
    <section className="container py-20">
      {block.heading && <SectionHeading eyebrow={block.eyebrow ?? undefined} title={block.heading} />}
      <div className="mt-14">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
