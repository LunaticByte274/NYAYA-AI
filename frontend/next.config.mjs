/**
 * ==========================================================================
 * NYAYA AI - NEXT.JS COMPILER CONFIGURATION (PROD v2.5.0 LTS)
 * ==========================================================================
 * Build: 8-BIT AVENGERS ULTIMATE COMPETITION MASTER
 * Target: Vercel Edge & High-Performance Caching
 * * CORE ENHANCEMENTS APPLIED:
 * 1. Security & Cost Protection: Removed wildcard image domains to prevent 
 * Image Optimization DDoS and Vercel bandwidth theft.
 * 2. Build Integrity: Restored TS/ESLint checks. Bypassing the compiler 
 * leads to runtime crashes. We fail at build, never in production.
 * 3. SWC Acceleration: Injected optimizePackageImports for Recharts & Lucide
 * to drastically reduce JavaScript bundle sizes.
 * 4. Security Headers: Removed 'X-Powered-By' header to mask tech stack.
 * ==========================================================================
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Core Performance & Security
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false, // Security: Prevents sniffing of your Next.js tech stack

  // 2. Advanced SWC Compiler Optimizations
  experimental: {
    // Drastically reduces client-side JS payload by automatically tree-shaking
    // massive libraries before they hit the browser.
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // 3. Image Optimization Security
  images: {
    // Enables modern, highly compressed image formats
    formats: ['image/avif', 'image/webp'], 
    // Wildcard '**' replaced with strict domain whitelisting
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.nyaya.ai', // Your backend image hosting
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Example: Allowed external avatar provider
      }
    ],
  },

  // 4. Enterprise Build Integrity
  typescript: {
    // We enforce type safety. If the build fails, the code needs fixing.
    ignoreBuildErrors: false, 
  },
  eslint: {
    // We enforce code quality. 
    ignoreDuringBuilds: false, 
  },
};

export default nextConfig;