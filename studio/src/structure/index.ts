import {BasketIcon, BookIcon, CogIcon, DiamondIcon, EnvelopeIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Store')
    .items([
      S.listItem()
        .title('Shop')
        .icon(DiamondIcon)
        .child(
          S.list()
            .title('Shop')
            .items([
              S.documentTypeListItem('product').title('Products'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('collection').title('Collections'),
            ]),
        ),
      S.documentTypeListItem('order').title('Orders').icon(BasketIcon),
      S.documentTypeListItem('subscriber').title('Subscribers').icon(EnvelopeIcon),
      S.divider(),
      S.listItem()
        .title('Journal')
        .icon(BookIcon)
        .child(
          S.list()
            .title('Journal')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('person').title('Authors'),
              S.documentTypeListItem('blogCategory').title('Categories'),
            ]),
        ),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
