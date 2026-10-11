/**
 * Adds photography and editorial content on top of scripts/seed.ts:
 * uploads Unsplash images (free Unsplash License) to products, categories, collections and the homepage hero,
 * and creates an author, three journal articles and the About and Care pages.
 * Safe to re-run: Sanity de-duplicates identical image uploads and documents use fixed IDs.
 *
 * Run from the studio folder: npm run seed:content
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-09-25'})

type Photo = {id: string; alt: string; credit: string}

const photo = (id: string, alt: string, credit: string): Photo => ({id, alt, credit})

const PRODUCT_IMAGES: Record<string, Photo[]> = {
  'product-solene-solitaire': [
    photo('photo-1598560917807-1bae44bd2be8', 'Yellow gold solitaire ring with a brilliant-cut diamond', 'Sabrianna'),
    photo('photo-1616121366004-b06829348d71', 'Delicate gold ring worn on a hand resting on a knit sweater', 'Happy Face Emoji'),
  ],
  'product-aurora-eternity': [
    photo('photo-1589674505081-080bfb716e6e', 'White gold band set with a continuous row of diamonds', 'Sabrianna'),
    photo('photo-1673385890456-c50405156d19', 'Diamond eternity band shown at an angle', 'Birgit Meyke'),
  ],
  'product-celeste-pendant': [
    photo('photo-1786052337709-6ac9a81e9fc4', 'Gold necklace with a pearl pendant', "César O'neill"),
    photo('photo-1682629846138-7db022565bd5', 'Pearl pendant on a fine chain against black velvet', 'Julie Sd'),
  ],
  'product-lumiere-lariat': [
    photo('photo-1727784635925-091ca2c1606b', 'Rose gold chain necklace laid on a pale table', 'PRAHANT STUDIO'),
    photo('photo-1763256614589-199db7a3bd51', 'Rose gold necklace with a pale gemstone drop', 'Ali Sarvari'),
  ],
  'product-iris-huggies': [
    photo('photo-1632525231035-c054cd5019db', 'Pair of small polished gold huggie hoops', 'JESUS ECA'),
    photo('photo-1781901726815-29af905d0b46', 'Gold hoop earrings, one textured and one smooth', 'Diego Castañeda'),
  ],
  'product-marisol-drops': [
    photo('photo-1535632066927-ab7c9ab60908', 'Sapphire drop earrings framed with diamonds', 'Arteum.ro'),
    photo('photo-1774504347388-3d01f7cac097', 'Sapphire and diamond earrings displayed on a branch', 'PRAHANT STUDIO'),
  ],
  'product-elise-tennis': [
    photo('photo-1763029513623-37d488cb97b1', 'Diamond tennis bracelet worn on the wrist', 'Giustina Barison'),
    photo('photo-1705575518997-82a71bcc75a2', 'Diamond line bracelet on a dark surface', 'sameer Ali'),
  ],
  'product-nova-cuff': [
    photo('photo-1681091638833-b2409f8ee8d8', 'Engraved sterling silver cuff bracelet', 'COPPERTIST WU'),
    photo('photo-1681091670739-8bd1e759e1ab', 'Silver cuff worn with a red knit sweater', 'COPPERTIST WU'),
  ],
}

const CATEGORY_IMAGES: Record<string, Photo> = {
  'category-rings': photo('photo-1599481805056-1c61a8975797', 'Hand wearing stacked gold rings', 'Mutzii'),
  'category-necklaces': photo('photo-1601821765780-754fa98637c1', 'Layered gold necklaces worn with a white shirt', 'Max Ducourneau'),
  'category-earrings': photo('photo-1671644730555-916aa8d8157f', 'Gold earring worn by a woman with blonde hair', 'Ruan Richard Rodrigues'),
  'category-bracelets': photo('photo-1619893454156-26a705ac9eb5', 'Hands adorned with stacked gold bracelets and rings', 'Khaled Ghareeb'),
}

const COLLECTION_IMAGES: Record<string, Photo> = {
  'collection-bridal': photo('photo-1529634806980-85c3dd6d34ac', 'Couple holding hands wearing wedding rings', 'Samantha Gades'),
  'collection-everyday': photo('photo-1633555234296-657a18d8b81a', 'Woman wearing a fine gold chain with a white shirt', 'Natalie Sysko'),
}

const HERO = photo('photo-1599459183200-59c7687a0275', 'Woman in a gold silk dress wearing layered gold necklaces', 'Kateryna Hliznitsova')
const ABOUT = photo('photo-1772442125299-dc4d557ec273', 'Jeweler working at a bench in the atelier', 'GN Group')
const AUTHOR = photo('photo-1580489944761-15a19d654956', 'Portrait of Elena Marchetti', 'Jake Nackos')
const POST_IMAGES = {
  layering: photo('photo-1531995811006-35cb42e1a022', 'Woman wearing layered gold pendant necklaces', 'Andie Gómez-Acebo'),
  care: photo('photo-1515562141207-7a88fb7ce338', 'Pearl necklace resting in an open jewelry box', 'Cornelia Ng'),
  craft: photo('photo-1786840320410-a7bec09c393c', 'Jeweler using a saw to shape a ring at the workbench', 'Spencer Liao'),
}

const uploaded = new Map<string, string>()

async function upload(p: Photo) {
  if (uploaded.has(p.id)) return uploaded.get(p.id)!
  const url = `https://images.unsplash.com/${p.id}?w=2000&q=82&fm=jpg`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${p.id}`)
  const asset = await client.assets.upload('image', Buffer.from(await res.arrayBuffer()), {
    filename: `${p.id}.jpg`,
    creditLine: `Photo by ${p.credit} on Unsplash`,
    source: {name: 'unsplash', id: p.id, url: `https://unsplash.com/photos/${p.id.replace('photo-', '')}`},
  })
  uploaded.set(p.id, asset._id)
  process.stdout.write('.')
  return asset._id
}

const image = async (p: Photo, withKey = false) => ({
  _type: 'imageWithAlt',
  ...(withKey ? {_key: p.id.slice(-12)} : {}),
  alt: p.alt,
  asset: {_type: 'reference', _ref: await upload(p)},
})

let k = 0
const key = () => `k${(k++).toString(36).padStart(6, '0')}`
const ref = (id: string, withKey = false) => ({_type: 'reference', _ref: id, ...(withKey ? {_key: id} : {})})
const block = (text: string, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})
const h2 = (text: string) => block(text, 'h2')
const quote = (text: string) => block(text, 'blockquote')

async function run() {
  console.log('Uploading images')
  const tx = client.transaction()

  for (const [id, photos] of Object.entries(PRODUCT_IMAGES)) {
    const imgs: Awaited<ReturnType<typeof image>>[] = []
    for (const ph of photos) imgs.push(await image(ph, true))
    tx.patch(id, (p) => p.set({images: imgs}))
  }
  for (const [id, ph] of Object.entries(CATEGORY_IMAGES)) {
    const img = await image(ph)
    tx.patch(id, (p) => p.set({image: img}))
  }
  for (const [id, ph] of Object.entries(COLLECTION_IMAGES)) {
    const img = await image(ph)
    tx.patch(id, (p) => p.set({heroImage: img}))
  }

  const heroImage = await image(HERO)
  tx.patch('siteSettings', (p) =>
    p.set({
      'hero.image': heroImage,
      ogImage: {_type: 'image', alt: HERO.alt, asset: heroImage.asset},
    }).setIfMissing({
      socialLinks: [
        {_type: 'socialLink', _key: 'instagram', platform: 'Instagram', url: 'https://instagram.com/'},
        {_type: 'socialLink', _key: 'pinterest', platform: 'Pinterest', url: 'https://pinterest.com/'},
      ],
    }),
  )

  const authorPicture = await image(AUTHOR)
  tx.createOrReplace({
    _id: 'person-elena-marchetti',
    _type: 'person',
    firstName: 'Elena',
    lastName: 'Marchetti',
    picture: {_type: 'image', alt: AUTHOR.alt, asset: authorPicture.asset},
  })

  const author = ref('person-elena-marchetti')
  const posts = [
    {
      id: 'post-art-of-layering',
      title: 'The Art of Layering Necklaces',
      slug: 'the-art-of-layering-necklaces',
      date: '2026-09-18T09:00:00Z',
      excerpt: 'Three lengths, one rule of thumb, and the pieces our stylists reach for every morning.',
      cover: POST_IMAGES.layering,
      categories: ['blogCategory-style'],
      related: ['product-celeste-pendant', 'product-lumiere-lariat', 'product-iris-huggies'],
      content: [
        block('A well-layered neckline looks effortless, but it rests on a little geometry. The secret is spacing: each chain should sit roughly two inches below the one above it, so that every piece has room to catch the light on its own.'),
        h2('Start with an anchor'),
        block('Choose one piece to lead. A pearl pendant or a gemstone drop gives the eye somewhere to land, and everything else is there to frame it. Keep the anchor at the middle length, around 18 inches, where it falls just below the collarbone.'),
        h2('Mix weights, not metals'),
        block('Pair a fine cable chain with something more substantial, such as a lariat or a paperclip link. Contrast in weight creates depth. If you are new to layering, keep to one metal tone: all yellow gold or all rose gold will always feel considered.'),
        quote('Layering is less about adding more and more about letting each piece breathe.'),
        h2('Finish at the ear'),
        block('A pair of polished huggies ties the look together without competing with the neckline. Small, close-fitting hoops echo the curve of the chains and keep the focus where you want it.'),
      ],
    },
    {
      id: 'post-caring-for-fine-jewelry',
      title: 'How to Care for Fine Jewelry',
      slug: 'how-to-care-for-fine-jewelry',
      date: '2026-08-30T09:00:00Z',
      excerpt: 'Simple daily habits that keep gold glowing, pearls lustrous and diamonds brilliant for generations.',
      cover: POST_IMAGES.care,
      categories: ['blogCategory-care'],
      related: ['product-celeste-pendant', 'product-aurora-eternity'],
      content: [
        block('Fine jewelry is made to be worn, and the pieces that are loved most often age the most beautifully. A few simple habits are all it takes to keep them looking as they did on the first day.'),
        h2('Last on, first off'),
        block('Put your jewelry on after perfume, lotion and hairspray have settled, and take it off before you exercise, swim or clean. Chemicals dull metal and can loosen settings over time.'),
        h2('Pearls need special care'),
        block('Pearls are organic and softer than gemstones. Wipe them with a soft, dry cloth after wearing and store them flat, never hanging, so the silk thread does not stretch.'),
        h2('Store pieces separately'),
        block('Diamonds can scratch other stones and even gold. Keep each piece in its own pouch or a lined compartment, and fasten chains before storing them to prevent tangles.'),
        quote('Every Aurelia piece includes complimentary cleaning and inspection for life. Simply bring it home to us.'),
      ],
    },
    {
      id: 'post-inside-the-atelier',
      title: 'Inside the Atelier: From Sketch to Setting',
      slug: 'inside-the-atelier',
      date: '2026-08-12T09:00:00Z',
      excerpt: 'Follow a solitaire from the first pencil line to the final polish at our workbench.',
      cover: POST_IMAGES.craft,
      categories: ['blogCategory-care'],
      related: ['product-solene-solitaire', 'product-elise-tennis'],
      content: [
        block('Every ring begins as a pencil sketch. Our designers draw at actual size, refining the proportions of the band and the height of the setting until the stone appears to float above the finger.'),
        h2('Casting in recycled gold'),
        block('Once the wax model is carved, it is cast in recycled 18k gold. Using reclaimed metal means no new mining, and the gold is indistinguishable in colour, strength and purity.'),
        h2('Setting the stone'),
        block('The setter shapes each claw by hand under magnification, seating the diamond so it is secure yet open to the light. It is slow, exacting work, and it is where a ring earns its brilliance.'),
        quote('A setting should hold a stone like a promise: securely, and without hiding it.'),
        block('A final polish, an inspection, and the piece is ready for its ivory box and the next chapter of its life.'),
      ],
    },
  ]

  for (const post of posts) {
    tx.createOrReplace({
      _id: post.id,
      _type: 'post',
      title: post.title,
      slug: {_type: 'slug', current: post.slug},
      date: post.date,
      excerpt: post.excerpt,
      coverImage: {_type: 'image', alt: post.cover.alt, asset: (await image(post.cover)).asset},
      author,
      categories: post.categories.map((id) => ref(id, true)),
      relatedProducts: post.related.map((id) => ref(id, true)),
      content: post.content,
    })
  }

  const aboutImage = await image(ABOUT)
  tx.createOrReplace({
    _id: 'page-about',
    _type: 'page',
    name: 'Our story',
    slug: {_type: 'slug', current: 'about'},
    heading: 'Our story',
    subheading: 'Heirloom jewelry, made slowly and responsibly, for the moments that matter.',
    pageBuilder: [
      {
        _type: 'infoSection',
        _key: 'intro',
        heading: 'Made by hand, meant for a lifetime',
        subheading: 'Since 2014',
        content: [
          block('Aurelia began at a single workbench with a simple idea: that fine jewelry should be beautiful enough to treasure and honest enough to feel good about. Every piece is still designed, cast and finished by hand in our atelier.'),
          block('We work exclusively with recycled gold and platinum, and with diamonds and gemstones we can trace from mine to setting. Fewer, better pieces, made to be worn every day and passed down.'),
        ],
      },
      {
        _type: 'callToAction',
        _key: 'atelier',
        eyebrow: 'The atelier',
        heading: 'Every piece passes through twelve pairs of hands',
        body: [
          block('From the first sketch to the final polish, our goldsmiths and setters bring decades of experience to each ring, pendant and bracelet.'),
        ],
        button: {
          _type: 'button',
          buttonText: 'Read about our craft',
          link: {_type: 'link', linkType: 'post', post: ref('post-inside-the-atelier')},
        },
        image: {_type: 'image', asset: aboutImage.asset},
        theme: 'dark',
        contentAlignment: 'textFirst',
      },
      {
        _type: 'featuredProducts',
        _key: 'signature',
        eyebrow: 'Signature pieces',
        heading: 'Where to begin',
        products: ['product-solene-solitaire', 'product-celeste-pendant', 'product-iris-huggies', 'product-elise-tennis'].map(
          (id) => ref(id, true),
        ),
      },
    ],
  })

  tx.createOrReplace({
    _id: 'page-care',
    _type: 'page',
    name: 'Jewelry care',
    slug: {_type: 'slug', current: 'care'},
    heading: 'Jewelry care',
    subheading: 'Keep your pieces as brilliant as the day you received them.',
    pageBuilder: [
      {
        _type: 'infoSection',
        _key: 'everyday',
        heading: 'Everyday care',
        subheading: 'Simple habits',
        content: [
          block('Put jewelry on last and take it off first. Avoid perfume, lotions, chlorine and household cleaners, and remove rings before exercise or gardening.'),
          block('Clean gold and diamonds with warm water, a drop of mild soap and a soft brush. Rinse and pat dry with a lint-free cloth. Pearls should only ever be wiped with a soft, dry cloth.'),
        ],
      },
      {
        _type: 'infoSection',
        _key: 'lifetime',
        heading: 'Lifetime care service',
        subheading: 'Complimentary, always',
        content: [
          block('Every Aurelia piece includes complimentary professional cleaning, polishing, stone tightening and one resize for life. Contact us to arrange insured shipping to our atelier.'),
        ],
      },
    ],
  })

  await tx.commit()
  console.log(`\nUploaded ${uploaded.size} images and created 3 journal posts, 1 author and 2 pages.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
