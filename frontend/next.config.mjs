/**
 * ==========================================================================
 * NYAYA AI - NEXT.JS COMPILER CONFIGURATION (PROD v2.6.0 APEX)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Vercel Edge, High-Performance Caching & Cloud Run Standalone
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Military-Grade Security Headers: Injected HSTS, X-Frame-Options, and 
 * X-Content-Type-Options at the edge router level.
 * 2. Standalone Output: Prepares the build for seamless Docker/Google Cloud 
 * Run migrations if Vercel limits are exceeded.
 * 3. SWC Acceleration: Injected optimizePackageImports for Recharts & Lucide
 * to drastically reduce JavaScript bundle sizes before hitting the browser.
 * 4. Build Integrity: Strict TS/ESLint checks enforced.
 * ==========================================================================
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Core Performance & Edge Security
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false, // Security: Prevents sniffing of your Next.js tech stack
  swcMinify: true, // Forces Rust-based SWC minifier for ultra-fast builds

  // Prepares the app for Google Cloud Run / Docker just in case
  output: 'standalone',

  // 2. Advanced SWC Compiler Optimizations
  experimental: {
    // Automatically tree-shakes massive libraries to reduce client payload
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // 3. Image Optimization Security
  images: {
    formats: ['image/avif', 'image/webp'], 
    // Strict domain whitelisting to prevent Vercel bandwidth theft
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.nyaya.ai', 
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', 
      }
    ],
  },

  // 4. Enterprise Build Integrity
  // ⚠️ HACKATHON ESCAPE HATCH: If your Vercel build fails due to a stray 
  // typescript/eslint error you cannot fix in time, change these both to `true`!
  typescript: {
    ignoreBuildErrors: false, 
  },
  eslint: {
    ignoreDuringBuilds: false, 
  },

  // 5. Strict Edge Security Headers Matrix
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN' // Prevents clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },
};

export default nextConfig;