'use client'

import {useEffect, useRef} from 'react'

/**
 * Fades its children up into view the first time they scroll into the viewport.
 * Styles live in globals.css under [data-reveal]; reduced-motion users see content immediately.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = 'shown'
          observer.disconnect()
        }
      },
      {rootMargin: '0px 0px -10% 0px'},
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal="hidden"
      className={className}
      style={delay ? {transitionDelay: `${delay}ms`} : undefined}
    >
      {children}
    </Tag>
  )
}
