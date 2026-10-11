import Link from 'next/link'

import DateComponent from '@/app/components/Date'
import JewelImage from '@/app/components/ui/JewelImage'
import type {AllPostsQueryResult} from '@/sanity.types'
import {dataAttr} from '@/sanity/lib/utils'

export default function PostCard({
  post,
  large = false,
}: {
  post: AllPostsQueryResult[number]
  large?: boolean
}) {
  const {_id, title, slug, excerpt, date, coverImage, categories} = post

  return (
    <article
      className="group relative flex flex-col"
      data-sanity={dataAttr({id: _id, type: 'post', path: 'title'}).toString()}
    >
      <div className={`relative overflow-hidden bg-cream ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <JewelImage
          image={coverImage}
          width={large ? 1200 : 800}
          sizes={large ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
          className="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 pt-6">
        <div className="eyebrow flex gap-3 text-[0.6rem] text-gold">
          {categories?.[0]?.title && <span>{categories[0].title}</span>}
          <span className="text-mist">
            <DateComponent dateString={date} />
          </span>
        </div>
        <h3 className={`font-serif leading-tight ${large ? 'text-4xl' : 'text-2xl'}`}>
          <Link href={`/journal/${slug}`} className="after:absolute after:inset-0 group-hover:text-gold-deep transition-colors">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="line-clamp-3 leading-relaxed text-stone">{excerpt}</p>}
        <span className="eyebrow mt-1 text-[0.6rem] text-ink underline decoration-champagne underline-offset-8">
          Read the story
        </span>
      </div>
    </article>
  )
}
