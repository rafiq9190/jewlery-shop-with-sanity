import {PortableTextBlock} from 'next-sanity'

import ResolvedLink from '@/app/components/ResolvedLink'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {buttonStyles} from '@/app/components/ui/button'
import {stegaClean} from '@sanity/client/stega'
import {ExtractPageBuilderType} from '@/sanity/lib/types'

type CtaProps = {
  block: ExtractPageBuilderType<'callToAction'>
  index: number
  // Needed if you want to createDataAttributes to do non-text overlays in Presentation (Visual Editing)
  pageType: string
  pageId: string
}

export default function CTA({block}: CtaProps) {
  const {heading, eyebrow, body = [], button, image, theme, contentAlignment} = block

  const isDark = theme === 'dark'
  const isImageFirst = stegaClean(contentAlignment) === 'imageFirst'

  return (
    <section className={isDark ? 'relative dark bg-ink text-ivory' : 'relative bg-cream/60'}>
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 py-20 items-center">
          <div
            className={`${isImageFirst && image ? 'row-start-2 lg:row-start-1 lg:col-start-2' : ''} flex flex-col gap-2 `}
          >
            {eyebrow && (
              <span className="eyebrow text-gold dark:text-champagne">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-4xl md:text-5xl dark:text-ivory">{heading}</h2>
            )}
            {body && (
              <div className="lg:text-left">
                <PortableText value={body as PortableTextBlock[]} className="dark:prose-invert" />
              </div>
            )}

            {button?.buttonText && button?.link && (
              <div className="flex mt-4">
                <ResolvedLink
                  link={button?.link}
                  className={isDark ? buttonStyles.light : buttonStyles.solid}
                >
                  {button?.buttonText}
                </ResolvedLink>
              </div>
            )}
          </div>

          {image?.asset?._ref && (
            <Image
              id={image.asset._ref}
              alt={(image as {alt?: string}).alt || ''}
              width={704}
              crop={image.crop}
              mode="cover"
              className="w-full"
            />
          )}
        </div>
      </div>
    </section>
  )
}
