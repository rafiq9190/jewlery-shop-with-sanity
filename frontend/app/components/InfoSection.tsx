import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import {InfoSection} from '@/sanity.types'

type InfoProps = {
  block: InfoSection
  index: number
  // Needed if you want to createDataAttributes to do non-text overlays in Presentation (Visual Editing)
  pageId: string
  pageType: string
}

export default function CTA({block}: InfoProps) {
  return (
    <div className="container my-16">
      <div className="mx-auto max-w-2xl">
        {block?.heading && <h2 className="text-4xl md:text-5xl">{block.heading}</h2>}
        {block?.subheading && (
          <span className="eyebrow mt-4 mb-8 block text-gold">
            {block.subheading}
          </span>
        )}
        <div className="mt-4">
          {block?.content?.length && (
            <PortableText className="" value={block.content as PortableTextBlock[]} />
          )}
        </div>
      </div>
    </div>
  )
}
