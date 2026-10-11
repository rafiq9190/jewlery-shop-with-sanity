const base =
  'eyebrow inline-flex items-center justify-center gap-3 px-8 py-4 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

export const buttonStyles = {
  solid: `${base} bg-ink text-ivory hover:bg-gold-deep`,
  outline: `${base} border border-ink/80 text-ink hover:bg-ink hover:text-ivory`,
  light: `${base} border border-ivory/70 text-ivory hover:bg-ivory hover:text-ink`,
  link: 'eyebrow inline-flex items-center gap-3 text-ink border-b border-champagne pb-1 hover:text-gold-deep transition-colors',
}
