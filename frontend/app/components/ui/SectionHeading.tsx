export default function SectionHeading({
  eyebrow,
  title,
  align = 'center',
  children,
}: {
  eyebrow?: string
  title: string
  align?: 'center' | 'left'
  children?: React.ReactNode
}) {
  const centered = align === 'center'
  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start'}`}>
      {eyebrow && <span className="eyebrow text-gold">{eyebrow}</span>}
      <h2 className="text-4xl md:text-5xl leading-[1.05]">{title}</h2>
      <span className={`hairline w-24 ${centered ? '' : 'bg-champagne'}`} aria-hidden />
      {children && <div className="max-w-xl text-stone leading-relaxed">{children}</div>}
    </div>
  )
}
