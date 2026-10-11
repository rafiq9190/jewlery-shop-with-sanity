'use client'

import {useState} from 'react'

import JewelImage from '@/app/components/ui/JewelImage'

type GalleryImage = {
  _key: string
  asset?: {_ref: string}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  alt?: string
}

export default function ProductGallery({images, name}: {images: GalleryImage[]; name: string}) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? null

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {images.length > 1 && (
        <ul className="flex gap-3 md:flex-col" aria-label={`${name} images`}>
          {images.map((image, i) => (
            <li key={image._key}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}${image.alt ? `: ${image.alt}` : ''}`}
                aria-pressed={i === active}
                className={`relative block aspect-[4/5] w-16 overflow-hidden bg-cream transition-opacity md:w-20 ${i === active ? 'ring-1 ring-gold ring-offset-2 ring-offset-ivory' : 'opacity-60 hover:opacity-100'}`}
              >
                <JewelImage image={image} width={160} height={200} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="group relative aspect-[4/5] flex-1 overflow-hidden bg-cream">
        <JewelImage
          key={current?._key}
          image={current}
          width={1200}
          height={1500}
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="animate-[fade-up_600ms_ease-out_both] transition-transform duration-[1.5s] group-hover:scale-110"
        />
      </div>
    </div>
  )
}
