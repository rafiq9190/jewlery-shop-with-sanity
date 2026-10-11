import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {product} from './documents/product'
import {category} from './documents/category'
import {collection} from './documents/collection'
import {order} from './documents/order'
import {blogCategory} from './documents/blogCategory'
import {subscriber} from './documents/subscriber'
import {productVariant} from './objects/productVariant'
import {imageWithAlt} from './objects/imageWithAlt'
import {featuredProducts} from './objects/featuredProducts'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  product,
  category,
  collection,
  order,
  page,
  post,
  person,
  blogCategory,
  subscriber,
  // Objects
  productVariant,
  imageWithAlt,
  featuredProducts,
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
]
