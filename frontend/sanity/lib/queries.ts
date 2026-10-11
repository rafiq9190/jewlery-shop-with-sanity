import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  featuredCollection->{
    _id,
    title,
    "slug": slug.current,
    tagline,
    description,
    heroImage
  }
}`)

const productCardFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  price,
  compareAtPrice,
  metal,
  "image": images[0],
  "hoverImage": images[1],
  "category": category->title,
  "soldOut": select(
    count(variants) > 0 => count(variants[stock > 0]) == 0,
    coalesce(stock, 0) <= 0
  ),
`

export const productsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)
    && (!defined($category) || category->slug.current == $category)
    && (!defined($metal) || metal == $metal)
    && (!defined($minPrice) || price >= $minPrice)
    && (!defined($maxPrice) || price <= $maxPrice)
  ] | order(featured desc, _createdAt desc) {
    ${productCardFields}
  }
`)

export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && featured == true && defined(slug.current)] | order(_createdAt desc) [0...8] {
    ${productCardFields}
  }
`)

export const productQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    ${productCardFields}
    _type,
    images,
    shortDescription,
    description,
    details,
    care,
    gemstones,
    stock,
    variants[]{_key, label, price, stock},
    "categoryRef": category->{_id, title, "slug": slug.current},
  }
`)

export const relatedProductsQuery = defineQuery(`
  *[_type == "product" && category._ref == $categoryId && _id != $skip && defined(slug.current)] | order(featured desc) [0...4] {
    ${productCardFields}
  }
`)

export const productSlugs = defineQuery(`
  *[_type == "product" && defined(slug.current)]
  {"slug": slug.current}
`)

export const categoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    image
  }
`)

export const collectionsQuery = defineQuery(`
  *[_type == "collection" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    heroImage
  }
`)

export const collectionQuery = defineQuery(`
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    tagline,
    description,
    heroImage,
    "products": products[]->{
      ${productCardFields}
    }
  }
`)

export const collectionSlugs = defineQuery(`
  *[_type == "collection" && defined(slug.current)]
  {"slug": slug.current}
`)

export const checkoutProductsQuery = defineQuery(`
  *[_type == "product" && _id in $ids] {
    _id,
    name,
    price,
    stock,
    "image": images[0],
    variants[]{_key, label, price, stock}
  }
`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  "categories": categories[]->{title, "slug": slug.current},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "featuredProducts" => {
        ...,
        "products": products[]->{
          ${productCardFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type in ["page", "post", "product", "collection"] && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)
    && (!defined($category) || $category in categories[]->slug.current)
  ] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
    "relatedProducts": relatedProducts[]->{
      ${productCardFields}
    }
  }
`)

export const blogCategoriesQuery = defineQuery(`
  *[_type == "blogCategory" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
