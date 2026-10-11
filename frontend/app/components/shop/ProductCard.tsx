import Link from 'next/link'

import JewelImage from '@/app/components/ui/JewelImage'
import Price from '@/app/components/ui/Price'
import type {ProductsQueryResult} from '@/sanity.types'
import {dataAttr} from '@/sanity/lib/utils'

export type ProductCardData = ProductsQueryResult[number]

export default function ProductCard({product, priority}: {product: ProductCardData; priority?: boolean}) {
  const {_id, name, slug, price, compareAtPrice, image, hoverImage, category, soldOut} = product
  const onSale = compareAtPrice != null && compareAtPrice > price

  return (
    <article
      className="group relative flex flex-col"
      data-sanity={dataAttr({id: _id, type: 'product', path: 'name'}).toString()}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <JewelImage
          image={image}
          width={720}
          height={900}
          sizes="(min-width: 1024px) 25vw, 50vw"
          priority={priority}
          className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        {hoverImage?.asset?._ref && (
          <JewelImage
            image={hoverImage}
            width={720}
            height={900}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        {(soldOut || onSale) && (
          <span className="eyebrow absolute left-3 top-3 bg-ivory/90 px-3 py-1.5 text-[0.6rem] text-ink">
            {soldOut ? 'Sold out' : 'Sale'}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 pt-5 text-center">
        <span className="eyebrow text-[0.6rem] text-mist">{category}</span>
        <h3 className="font-serif text-xl leading-snug">
          <Link href={`/shop/${slug}`} className="after:absolute after:inset-0">
            {name}
          </Link>
        </h3>
        <Price price={price} compareAtPrice={compareAtPrice} className="text-sm text-stone" />
      </div>
    </article>
  )
}
