/**
 * Seeds the dataset with starter categories, collections and products so the storefront renders immediately.
 * Safe to re-run: catalog documents use fixed IDs, and settings are only filled where empty.
 *
 * Run from the studio folder: npx sanity exec scripts/seed.ts --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-09-25'})

const ref = (id: string) => ({_type: 'reference', _ref: id})
const key = () => Math.random().toString(36).slice(2, 12)
const text = (value: string) => [
  {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text: value, marks: []}],
  },
]
const ringSizes = (price?: number) =>
  ['5', '6', '7', '8'].map((size) => ({
    _type: 'productVariant',
    _key: `size-${size}`,
    label: `Size ${size}`,
    stock: 4,
    ...(price ? {price} : {}),
  }))

const categories = [
  {id: 'category-rings', title: 'Rings', order: 1},
  {id: 'category-necklaces', title: 'Necklaces', order: 2},
  {id: 'category-earrings', title: 'Earrings', order: 3},
  {id: 'category-bracelets', title: 'Bracelets', order: 4},
]

const products = [
  {
    id: 'product-solene-solitaire',
    name: 'Solène Solitaire Ring',
    category: 'category-rings',
    price: 1450,
    metal: 'yellow-gold',
    gemstones: ['Diamond'],
    featured: true,
    shortDescription: 'A single brilliant-cut diamond held aloft in a delicate four-claw setting.',
    variants: ringSizes(),
  },
  {
    id: 'product-aurora-eternity',
    name: 'Aurora Eternity Band',
    category: 'category-rings',
    price: 980,
    compareAtPrice: 1150,
    metal: 'white-gold',
    gemstones: ['Diamond'],
    featured: true,
    shortDescription: 'A continuous circle of pavé diamonds that catches light from every angle.',
    variants: ringSizes(),
  },
  {
    id: 'product-celeste-pendant',
    name: 'Céleste Pearl Pendant',
    category: 'category-necklaces',
    price: 420,
    metal: 'yellow-gold',
    gemstones: ['Freshwater pearl'],
    featured: true,
    shortDescription: 'A luminous freshwater pearl suspended from a fine 18k gold chain.',
    variants: [
      {_type: 'productVariant', _key: 'len-16', label: '16 inch chain', stock: 6},
      {_type: 'productVariant', _key: 'len-18', label: '18 inch chain', stock: 6},
    ],
  },
  {
    id: 'product-lumiere-lariat',
    name: 'Lumière Lariat',
    category: 'category-necklaces',
    price: 680,
    metal: 'rose-gold',
    gemstones: ['Morganite'],
    shortDescription: 'A fluid lariat finished with a soft-pink morganite drop.',
    stock: 5,
  },
  {
    id: 'product-iris-huggies',
    name: 'Iris Huggie Hoops',
    category: 'category-earrings',
    price: 320,
    metal: 'yellow-gold',
    gemstones: [],
    featured: true,
    shortDescription: 'Sculpted everyday huggies with a high-polish finish.',
    stock: 10,
  },
  {
    id: 'product-marisol-drops',
    name: 'Marisol Sapphire Drops',
    category: 'category-earrings',
    price: 890,
    metal: 'white-gold',
    gemstones: ['Sapphire', 'Diamond'],
    shortDescription: 'Deep-blue sapphires framed by a halo of diamonds.',
    stock: 3,
  },
  {
    id: 'product-elise-tennis',
    name: 'Élise Tennis Bracelet',
    category: 'category-bracelets',
    price: 2100,
    metal: 'platinum',
    gemstones: ['Diamond'],
    featured: true,
    shortDescription: 'A line of perfectly matched diamonds set in platinum.',
    stock: 2,
  },
  {
    id: 'product-nova-cuff',
    name: 'Nova Sculpted Cuff',
    category: 'category-bracelets',
    price: 540,
    metal: 'silver',
    gemstones: [],
    shortDescription: 'A bold, organic cuff hand-finished in sterling silver.',
    stock: 7,
  },
]

const collections = [
  {
    id: 'collection-bridal',
    title: 'The Bridal Edit',
    tagline: 'For the moments that last forever',
    description:
      'Solitaires, eternity bands and heirloom-worthy pieces, crafted for the most meaningful day.',
    products: ['product-solene-solitaire', 'product-aurora-eternity', 'product-elise-tennis'],
  },
  {
    id: 'collection-everyday',
    title: 'Everyday Gold',
    tagline: 'Effortless pieces to wear and layer daily',
    description: 'Light, lustrous and made to be lived in.',
    products: ['product-iris-huggies', 'product-celeste-pendant', 'product-lumiere-lariat'],
  },
]

async function run() {
  const tx = client.transaction()

  for (const c of categories) {
    tx.createOrReplace({
      _id: c.id,
      _type: 'category',
      title: c.title,
      order: c.order,
      slug: {_type: 'slug', current: c.title.toLowerCase()},
    })
  }

  for (const p of products) {
    tx.createOrReplace({
      _id: p.id,
      _type: 'product',
      name: p.name,
      slug: {_type: 'slug', current: p.id.replace('product-', '')},
      category: ref(p.category),
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      metal: p.metal,
      gemstones: p.gemstones,
      featured: p.featured ?? false,
      shortDescription: p.shortDescription,
      description: text(
        `${p.shortDescription} Each piece is handcrafted in our atelier using responsibly sourced materials and finished by hand.`,
      ),
      details: 'Handcrafted to order. Arrives in our signature ivory gift box.',
      care: 'Store separately in the pouch provided. Avoid contact with perfume and water. Polish gently with a soft cloth.',
      variants: p.variants,
      stock: p.variants ? undefined : p.stock,
    })
  }

  for (const c of collections) {
    tx.createOrReplace({
      _id: c.id,
      _type: 'collection',
      title: c.title,
      tagline: c.tagline,
      description: c.description,
      slug: {_type: 'slug', current: c.id.replace('collection-', '')},
      products: c.products.map((id) => ({...ref(id), _key: id})),
    })
  }

  tx.createOrReplace({
    _id: 'blogCategory-style',
    _type: 'blogCategory',
    title: 'Style Guides',
    slug: {_type: 'slug', current: 'style-guides'},
  })
  tx.createOrReplace({
    _id: 'blogCategory-care',
    _type: 'blogCategory',
    title: 'Care & Craft',
    slug: {_type: 'slug', current: 'care-and-craft'},
  })

  tx.createIfNotExists({_id: 'siteSettings', _type: 'settings', title: 'Aurelia'})
  tx.patch('siteSettings', (patch) =>
    patch.setIfMissing({
      announcement: 'Complimentary insured shipping on orders over $200',
      hero: {
        eyebrow: 'Fine jewelry, made by hand',
        heading: 'Timeless',
        headingAccent: 'brilliance',
        subheading:
          'Heirloom-quality pieces in recycled gold and ethically sourced stones, designed to be worn every day and treasured for generations.',
        ctaLabel: 'Shop the collection',
      },
      featuredCollection: ref('collection-bridal'),
    }),
  )

  await tx.commit()
  console.log(
    `Seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections and 2 journal categories.`,
  )
  console.log('Next: add product images in the Studio (Shop → Products → Images).')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
