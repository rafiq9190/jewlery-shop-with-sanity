import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  async redirects() {
    return [
      {
        // The blog moved from /posts to /journal
        source: '/posts/:slug',
        destination: '/journal/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
