const defaultRuntimeCaching = require('next-pwa/cache')

const disablePWA =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_DISABLE_PWA === 'true'

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: disablePWA,
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Supabase API must always go to network to avoid SW/workbox stale/error responses.
      urlPattern:
        /^https:\/\/wygsrnmffypsbjbtjdn\.supabase\.co\/(rest|auth|storage)\/v1\/.*/i,
      handler: 'NetworkOnly'
    },
    ...defaultRuntimeCaching
  ]
})

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wygsrnmffypsbjbtjdn.supabase.co'
      }
    ]
  }
})
