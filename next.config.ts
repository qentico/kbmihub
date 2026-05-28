import type { NextConfig } from 'next'

const SUPABASE = 'https://qugcyiutsqekqgpcmpsn.supabase.co'

const csp = [
  "default-src 'self'",
  // Next.js inlines bootstrap scripts; unsafe-inline is required without nonce middleware
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Supabase Storage for images and uploaded media
  `img-src 'self' data: blob: ${SUPABASE}`,
  `media-src 'self' blob: ${SUPABASE}`,
  // Geist font is self-hosted by next/font at build time — no external font CDN needed
  "font-src 'self'",
  // All Supabase REST + Auth API calls
  `connect-src 'self' ${SUPABASE}`,
  // Prevent this page from being framed anywhere (clickjacking)
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options',        value: 'nosniff' },
  { key: 'X-Frame-Options',               value: 'DENY' },
  { key: 'Referrer-Policy',               value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',            value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS — tells browsers to only use HTTPS for 2 years; Vercel already enforces HTTPS
  { key: 'Strict-Transport-Security',     value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy',       value: csp },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
