import ProductCard, {type ProductCardData} from '@/app/components/shop/ProductCard'
import Reveal from '@/app/components/ui/Reveal'

export default function ProductGrid({
  products,
  columns = 4,
}: {
  products: ProductCardData[]
  columns?: 3 | 4
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 ${columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
    >
      {products.map((product, i) => (
        <Reveal as="li" key={product._id} delay={(i % columns) * 90}>
          <ProductCard product={product} priority={i < columns} />
        </Reveal>
      ))}
    </ul>
  )
}
