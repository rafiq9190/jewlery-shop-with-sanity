'use client'

import {useState} from 'react'

import {useCart} from '@/app/components/cart/CartProvider'
import {buttonStyles} from '@/app/components/ui/button'
import Price from '@/app/components/ui/Price'

type Variant = {_key: string; label: string; price: number | null; stock: number}

export default function AddToBag({
  product,
}: {
  product: {
    _id: string
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    stock: number | null
    imageRef: string | null
    variants: Variant[] | null
  }
}) {
  const {add} = useCart()
  const variants = product.variants ?? []
  const [selectedKey, setSelectedKey] = useState<string | null>(
    variants.find((v) => v.stock > 0)?._key ?? null,
  )
  const selected = variants.find((v) => v._key === selectedKey) ?? null
  const price = selected?.price ?? product.price
  const stock = variants.length > 0 ? (selected?.stock ?? 0) : (product.stock ?? 0)
  const soldOut = stock <= 0

  return (
    <div className="space-y-8">
      <Price price={price} compareAtPrice={product.compareAtPrice} className="text-2xl" />

      {variants.length > 0 && (
        <fieldset>
          <legend className="eyebrow mb-4 text-stone">
            {variants[0].label.toLowerCase().startsWith('size') ? 'Ring size' : 'Option'}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const unavailable = v.stock <= 0
              return (
                <label
                  key={v._key}
                  className={`relative cursor-pointer border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-gold ${
                    selectedKey === v._key
                      ? 'border-ink bg-ink text-ivory'
                      : 'border-sand hover:border-ink'
                  } ${unavailable ? 'cursor-not-allowed text-mist line-through hover:border-sand' : ''}`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={v._key}
                    checked={selectedKey === v._key}
                    disabled={unavailable}
                    onChange={() => setSelectedKey(v._key)}
                    className="sr-only"
                  />
                  {v.label.replace(/^Size /, '')}
                  {unavailable && <span className="sr-only"> (sold out)</span>}
                </label>
              )
            })}
          </div>
        </fieldset>
      )}

      <div className="space-y-3">
        <button
          type="button"
          disabled={soldOut}
          className={`${buttonStyles.solid} w-full`}
          onClick={() =>
            add({
              productId: product._id,
              variantKey: selected?._key ?? null,
              variantLabel: selected?.label ?? null,
              name: product.name,
              slug: product.slug,
              price,
              imageRef: product.imageRef,
              quantity: 1,
            })
          }
        >
          {soldOut ? 'Sold out' : 'Add to bag'}
        </button>
        {!soldOut && stock <= 3 && (
          <p className="text-center text-sm italic text-gold-deep">Only {stock} left — handcrafted in small batches</p>
        )}
      </div>
    </div>
  )
}
