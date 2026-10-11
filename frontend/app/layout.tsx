import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Cormorant_Garamond, Jost} from 'next/font/google'
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import CartDrawer from '@/app/components/cart/CartDrawer'
import {CartProvider} from '@/app/components/cart/CartProvider'
import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <CartProvider>
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster position="bottom-center" toastOptions={{className: 'font-sans'}} />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
