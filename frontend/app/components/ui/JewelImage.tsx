import Image from '@/app/components/SanityImage'

type ImageValue = {
  asset?: {_ref: string}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  alt?: string
} | null

/**
 * Sanity image that fills its (relatively positioned) parent, with a soft champagne placeholder when no image is set yet.
 */
export default function JewelImage({
  image,
  width = 800,
  height,
  sizes,
  className = '',
  priority = false,
}: {
  image?: ImageValue
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
}) {
  if (!image?.asset?._ref) {
    return <JewelPlaceholder className={className} />
  }
  return (
    <Image
      id={image.asset._ref}
      alt={image.alt || ''}
      width={width}
      height={height}
      sizes={sizes}
      hotspot={image.hotspot}
      crop={image.crop}
      mode="cover"
      loading={priority ? 'eager' : 'lazy'}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  )
}

export function JewelPlaceholder({className = ''}: {className?: string}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#fffaf0_0%,#f2ece2_45%,#e6dccb_100%)] ${className}`}
    >
      <svg viewBox="0 0 64 64" className="w-1/5 max-w-20 text-champagne" fill="none" stroke="currentColor" strokeWidth="0.75">
        <path d="M14 24 L22 12 H42 L50 24 L32 54 Z" />
        <path d="M14 24 H50 M22 12 L28 24 L32 54 L36 24 L42 12 M28 24 L32 12 L36 24" />
      </svg>
    </div>
  )
}
